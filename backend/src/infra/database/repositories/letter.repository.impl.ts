import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ILettersRepository } from "../../../core/application/interfaces/repositories/letter.repository"
import { Letters } from "../../../core/domain/entities/letter.entity"
import { Users } from "../../../core/domain/entities/user.entity"
import { Matches } from "../../../core/domain/entities/match.entity"
import { CreateLetterRequest } from "../../../core/application/dtos/letters/request/create-letter-request"
import { GetAllLetterAdminRequest } from "../../../core/application/dtos/letters/request/get-all-letter-admin-request"
import {
    GetAllLetterReceivedRequest
} from "../../../core/application/dtos/letters/request/get-all-letter-received-request"
import { GetAllLetterSentRequest } from "../../../core/application/dtos/letters/request/get-all-letter-sent-request"
import { ReplyLetterRequest } from "src/core/application/dtos/letters/request/reply-letter.-request"
import { SendRandomLetterRequest } from "src/core/application/dtos/letters/request/send-letter-random-request"
import { CheckReplyResponse } from "../../../core/application/dtos/letters/response/check-reply-response"
import { Reports } from "../../../core/domain/entities/report.entity"

@Injectable()
export class LettersRepositoryImpl implements ILettersRepository {
    constructor(
        @InjectRepository(Letters)
        private readonly lettersRepo: Repository<Letters>,
        @InjectRepository(Users)
        private readonly usersRepo: Repository<Users>,
        @InjectRepository(Matches)
        private readonly matchesRepo: Repository<Matches>,
        @InjectRepository(Reports)
        private readonly reportsRepo: Repository<Reports>,
    ) {
    }

    count(options: any): Promise<number> {
        return this.lettersRepo.count(options);
    }

    async checkReply(letterId: string): Promise<CheckReplyResponse> {
        const letter = await this.lettersRepo.findOne({
            where: { id: letterId },
            select: ['id', 'isReply'],
        });
        if (!letter) {
            throw new NotFoundException("Letter not found");
        }

        const isReported = await this.reportsRepo.exists({
            where: { targetLetter: { id: letterId } },
        });

        return {
            isReply: letter.isReply,
            isReported: isReported,
        };
    }

    async createRandomLetter(senderId: string, data: SendRandomLetterRequest): Promise<Letters> {
        const sender = await this.usersRepo.findOne({ where: { id: senderId }, relations: ['settings'] });
        if (!sender) throw new NotFoundException("Sender not found");

        const senderMood = sender.settings?.preferredMoods?.[0] || 'NEUTRAL';

        const noRecentMatchFilter = (qb: any) => {
            const subQuery = qb.subQuery()
                .select("1")
                .from(Matches, "m")
                .where("m.senderId = :senderId", { senderId })
                .andWhere("m.receiverId = u.id")
                .andWhere("m.created_at >= NOW() - INTERVAL '24 HOURS'")
                .getQuery();
            return `NOT EXISTS (${subQuery})`;
        };

        let recipient = await this.usersRepo
            .createQueryBuilder("u")
            .leftJoinAndSelect("u.settings", "settings")
            .where("u.id != :senderId", { senderId })
            .andWhere("u.isAdmin = false")
            .andWhere("settings.allowRandomMessages = true")
            .andWhere(":mood = ANY (SELECT jsonb_array_elements_text(settings.preferredMoods))", { mood: senderMood })
            .andWhere(noRecentMatchFilter)
            .orderBy("RANDOM()")
            .getOne();

        if (!recipient) {
            recipient = await this.usersRepo
                .createQueryBuilder("u")
                .leftJoinAndSelect("u.settings", "settings")
                .where("u.id != :senderId", { senderId })
                .andWhere("u.isAdmin = false")
                .andWhere(":neutral = ANY (SELECT jsonb_array_elements_text(settings.preferredMoods))", { neutral: 'NEUTRAL' })
                .andWhere(noRecentMatchFilter)
                .orderBy("RANDOM()")
                .getOne();
        }

        if (!recipient) {
            recipient = await this.usersRepo
                .createQueryBuilder("u")
                .leftJoinAndSelect("u.settings", "settings")
                .where("u.id != :senderId", { senderId })
                .andWhere("u.isAdmin = false")
                .andWhere(noRecentMatchFilter)
                .orderBy("RANDOM()")
                .getOne();
        }

        if (!recipient) throw new Error("No suitable recipient available");

        const match = this.matchesRepo.create({ sender, receiver: recipient });
        await this.matchesRepo.save(match);

        const letter = this.lettersRepo.create({
            content: data.content,
            mood: data.mood,
            user: sender,
            match,
            isRead: false,
            isReply: false,
            isSent: false,
            sendAt: this.calculateSendAt()
        });

        return this.lettersRepo.save(letter);
    }

    /** USER REPLIES INSIDE MATCH (draft, isSent=false) */
    async replyLetter(senderId: string, data: ReplyLetterRequest): Promise<Letters> {
        const originalLetter = await this.lettersRepo.findOne({
            where: { id: data.letterId },
            relations: ['user', 'match', 'match.sender', 'match.receiver'],
        });
        if (!originalLetter) throw new NotFoundException("Original letter not found");

        const match = originalLetter.match;
        if (!match || match.id !== data.matchId) throw new BadRequestException("Letter does not belong to this match");
        if (match.sender.id !== senderId && match.receiver.id !== senderId) throw new BadRequestException("User not part of this match");
        if (originalLetter.user.id === senderId) throw new BadRequestException("You cannot reply to your own letter");
        if (originalLetter.isReply) throw new BadRequestException("This letter has already been replied to");

        const sender = await this.usersRepo.findOne({ where: { id: senderId } });
        if (!sender) throw new NotFoundException("User not found");

        const letter = this.lettersRepo.create({
            content: data.content,
            user: sender,
            match,
            isRead: false,
            isReply: false,
            isSent: false,
            sendAt: this.calculateSendAt()
        });

        originalLetter.isReply = true;
        await this.lettersRepo.save(originalLetter);

        return this.lettersRepo.save(letter);
    }

    async createLetter(data: CreateLetterRequest): Promise<Letters> {
        const user = await this.usersRepo.findOne({ where: { id: data.userId } });
        const entity = this.lettersRepo.create({
            content: data.content,
            mood: data.mood,
            isRead: false,
            isReply: false,
            isSent: false,
            user,
            match: data.matchId ? { id: data.matchId } as Matches : null,
        } as Partial<Letters>);
        return this.lettersRepo.save(entity);
    }

    async getAllLetterAdmin(req: GetAllLetterAdminRequest) {
        const page = Number(req.page) || 1;
        const pageSize = Number(req.pageSize) || 10;
        const qb = this.lettersRepo
            .createQueryBuilder('letters')
            .leftJoinAndSelect('letters.user', 'user')
            .leftJoinAndSelect('letters.match', 'match');

        if (req.userId) qb.andWhere('user.id = :userId', { userId: req.userId });
        if (req.matchId) qb.andWhere('match.id = :matchId', { matchId: req.matchId });
        if (req.mood) qb.andWhere('letters.mood = :mood', { mood: req.mood });
        if (req.search) qb.andWhere('letters.content ILIKE :search', { search: `%${req.search}%` });

        const sortColumn = req.sortBy?.includes('.') ? req.sortBy : `letters.${req.sortBy || 'created_at'}`;
        qb.orderBy(sortColumn, req.sortOrder ?? 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize);

        const [items, total] = await qb.getManyAndCount();
        return { items, total, page, pageSize };
    }

    async getAllLetterReceived(userId: string, req: GetAllLetterReceivedRequest) {
        const page = Number(req.page) || 1;
        const pageSize = Number(req.pageSize) || 10;
        const qb = this.lettersRepo
            .createQueryBuilder('letters')
            .leftJoinAndSelect('letters.user', 'sender')
            .leftJoinAndSelect('letters.match', 'match')
            .leftJoinAndSelect('match.sender', 'matchSender')
            .leftJoinAndSelect('match.receiver', 'receiver')
            .where('(match.senderId = :id OR match.receiverId = :id)', { id: userId })
            .andWhere('sender.id != :id', { id: userId })
            .andWhere('letters.isSent = true');

        if (req.search) qb.andWhere('sender.id = :sid', { sid: req.search });
        if (req.mood) qb.andWhere('letters.mood = :mood');
        if (req.startDate) qb.andWhere('letters.created_at >= :startDate', { startDate: req.startDate });
        if (req.endDate) qb.andWhere('letters.created_at <= :endDate', { endDate: req.endDate });
        
        const allowed = new Set(['created_at', 'updated_at', 'mood']);
        let sortColumn = 'letters.created_at';
        if (req.sortBy?.includes('.')) sortColumn = req.sortBy;
        else if (req.sortBy && allowed.has(req.sortBy)) sortColumn = `letters.${req.sortBy}`;

        qb.orderBy(sortColumn, (req.sortOrder ?? 'DESC') as 'ASC' | 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize);

        const [items, total] = await qb.getManyAndCount();
        return { items, total, page, pageSize };
    }

    async getAllLetterSent(userId: string, req: GetAllLetterSentRequest) {
        const page = Number(req.page) || 1;
        const pageSize = Number(req.pageSize) || 10;
        const qb = this.lettersRepo
            .createQueryBuilder('letters')
            .leftJoinAndSelect('letters.user', 'sender')
            .leftJoinAndSelect('letters.match', 'match')
            .leftJoinAndSelect('match.receiver', 'receiver')
            .leftJoinAndSelect('match.sender', 'matchSender')
            .where('letters.userId = :id', { id: userId })

        if (req.search) qb.andWhere('receiver.id = :receiverId', { receiverId: req.search });
        if (req.mood) qb.andWhere('letters.mood = :mood', { mood: req.mood });
        if (req.startDate) qb.andWhere('letters.created_at >= :startDate', { startDate: req.startDate });
        if (req.endDate) qb.andWhere('letters.created_at <= :endDate', { endDate: req.endDate });

        const allowedSortFields = ['created_at', 'mood', 'id'];
        const field = allowedSortFields.includes(req.sortBy!)
            ? `letters.${req.sortBy}`
            : 'letters.created_at';
        const order = req.sortOrder === 'ASC' ? 'ASC' : 'DESC';

        qb.orderBy(field, order)
            .skip((page - 1) * pageSize)
            .take(pageSize);

        const [items, total] = await qb.getManyAndCount();
        return { items, total, page, pageSize };
    }

    async getLetterByUserId(id: string): Promise<Letters | null> {
        return this.lettersRepo.findOne({ where: { id }, relations: ['user', 'match'] });
    }

    async getLetterByUserId2(id: string): Promise<Letters | null> {
        return this.lettersRepo.findOne({ where: { id }, relations: ['user', 'match'] });
    }
    async deleteLetter(id: string): Promise<void> {
        await this.lettersRepo.delete(id);
    }

    async countReceivedLetters(userId: string): Promise<number> {
        return this.lettersRepo
            .createQueryBuilder('letters')
            .leftJoin('letters.match', 'match')
            .where('(match.receiverId = :userId OR match.senderId = :userId)', { userId })
            .andWhere('letters.user != :userId', { userId })
            .andWhere('letters.isSent = true')
            .getCount();
    }

    async countDistinctConnections(userId: string): Promise<number> {
        const raw = await this.lettersRepo
            .createQueryBuilder('letters')
            .select('COUNT(DISTINCT letters.match)', 'count')
            .where('letters.user = :userId', { userId })
            .andWhere('letters.isSent = true')
            .getRawOne();
        return Number(raw.count);
    }

    async countUnreadLetters(userId: string): Promise<number> {
        return await this.lettersRepo
            .createQueryBuilder('letter')
            .innerJoin('letter.match', 'match')
            .innerJoin('letter.user', 'sender')
            .where('(match.receiverId = :userId OR match.senderId = :userId)', { userId })
            .andWhere('sender.id != :userId', { userId })
            .andWhere('letter.isRead = false')
            .andWhere('letter.isSent = true')
            .getCount();
    }

    async markAsRead(letterId: string, userId: string): Promise<void> {
        const letter = await this.lettersRepo.findOne({ where: { id: letterId }, relations: ['match'] });
        if (!letter) throw new Error('Letter not found');
        letter.isRead = true;
        await this.lettersRepo.save(letter);
    }

    private calculateSendAt(): Date {
        const now = new Date();
        const sendTime = new Date();
        sendTime.setHours(7, 0, 0, 0);
        if (now.getTime() >= sendTime.getTime()) sendTime.setDate(sendTime.getDate() + 1);
        return sendTime;
    }
}
