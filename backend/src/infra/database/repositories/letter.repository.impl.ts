import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ILettersRepository} from "../../../core/application/interfaces/repositories/letter.repository";
import {Letters} from "../../../core/domain/entities/letter.entity";
import {Users} from "../../../core/domain/entities/user.entity";
import {Matches} from "../../../core/domain/entities/match.entity";
import {CreateLetterRequest} from "../../../core/application/dtos/letters/request/create-letter-request";
import {GetAllLetterAdminRequest} from "../../../core/application/dtos/letters/request/get-all-letter-admin-request";
import {
    GetAllLetterReceivedRequest
} from "../../../core/application/dtos/letters/request/get-all-letter-received-request";
import {GetAllLetterSentRequest} from "../../../core/application/dtos/letters/request/get-all-letter-sent-request";
import {ReplyLetterRequest} from "src/core/application/dtos/letters/request/reply-letter.-request";
import {SendRandomLetterRequest} from "src/core/application/dtos/letters/request/send-letter-random-request";

@Injectable()
export class LettersRepositoryImpl implements ILettersRepository {
    constructor(
        @InjectRepository(Letters)
        private readonly lettersRepo: Repository<Letters>,
        @InjectRepository(Users)
        private readonly usersRepo: Repository<Users>,
        @InjectRepository(Matches)
        private readonly matchesRepo: Repository<Matches>,
    ) {
    }

    /**
     * USER SEND RANDOM LETTER
     */
    async createRandomLetter(
        senderId: string,
        data: SendRandomLetterRequest
    ): Promise<Letters> {
        // 1. Lấy thông tin sender
        const sender = await this.usersRepo.findOne({
            where: {id: senderId},
            relations: ['settings'],
        });
        if (!sender) throw new NotFoundException("Sender not found");

        // 2. Lấy mood sender (JSONB chỉ 1 phần tử)
        const senderMood = sender.settings?.preferredMoods?.[0] || 'NEUTRAL';

        // 3. Hàm anti-swiping filter: không gửi cùng 1 receiver trong 24h
        const noRecentMatchFilter = (qb: any) => {
            const subQuery = qb.subQuery()
                .select("1")
                .from(Matches, "m")
                .where("m.senderId = :senderId", {senderId})
                .andWhere("m.receiverId = u.id")
                .andWhere("m.created_at >= NOW() - INTERVAL '24 HOURS'")
                .getQuery();
            return `NOT EXISTS (${subQuery})`;
        };

        // 4. Step 1: tìm user mood trùng sender
        let recipient = await this.usersRepo
            .createQueryBuilder("u")
            .leftJoinAndSelect("u.settings", "settings")
            .where("u.id != :senderId", {senderId})
            .andWhere("u.isAdmin = false")
            .andWhere("settings.allowRandomMessages = true")
            .andWhere(":mood = ANY (SELECT jsonb_array_elements_text(settings.preferredMoods))", {mood: senderMood})
            .andWhere(noRecentMatchFilter)
            .orderBy("RANDOM()")
            .getOne();

        if (!recipient) {
            recipient = await this.usersRepo
                .createQueryBuilder("u")
                .leftJoinAndSelect("u.settings", "settings")
                .where("u.id != :senderId", {senderId})
                .andWhere("u.isAdmin = false")
                .andWhere(":neutral = ANY (SELECT jsonb_array_elements_text(settings.preferredMoods))", {neutral: 'NEUTRAL'})
                .andWhere(noRecentMatchFilter)
                .orderBy("RANDOM()")
                .getOne();
        }

        if (!recipient) {
            recipient = await this.usersRepo
                .createQueryBuilder("u")
                .leftJoinAndSelect("u.settings", "settings")
                .where("u.id != :senderId", {senderId})
                .andWhere("u.isAdmin = false")
                .andWhere(noRecentMatchFilter)
                .orderBy("RANDOM()")
                .getOne();
        }

        // 7. Nếu vẫn không tìm được → throw (rất hiếm xảy ra)
        if (!recipient) throw new Error("No suitable recipient available");

        // 8. Tạo match
        const match = this.matchesRepo.create({
            sender,
            receiver: recipient,
        });
        await this.matchesRepo.save(match);

        // 9. Tạo và lưu letter
        const letter = this.lettersRepo.create({
            content: data.content,
            mood: data.mood,
            user: sender,
            match,
            isSent: true,
        });

        return this.lettersRepo.save(letter);
    }


    /**
     * USER REPLIES INSIDE MATCH → ADD NEW LETTER
     */
    async replyLetter(senderId: string, data: ReplyLetterRequest): Promise<Letters> {
        const match = await this.matchesRepo.findOne({
            where: {id: data.matchId},
            relations: ['sender', 'receiver'],
        });

        if (!match) throw new NotFoundException("Match not found");

        // Validate user belongs to match
        if (match.sender.id !== senderId && match.receiver.id !== senderId) {
            throw new BadRequestException("User not part of this match");
        }

        const sender = await this.usersRepo.findOne({where: {id: senderId}});

        const letter = this.lettersRepo.create({
            content: data.content,
            user: sender,
            match,
            isSent: true,
        } as Partial<Letters>);

        return this.lettersRepo.save(letter);
    }

    /**
     * CREATE UNSENT LETTER (draft)
     */
    async createLetter(data: CreateLetterRequest): Promise<Letters> {
        const user = await this.usersRepo.findOne({where: {id: data.userId}});

        const entity = this.lettersRepo.create({
            content: data.content,
            mood: data.mood,
            isSent: false,
            user,
            match: data.matchId ? {id: data.matchId} as Matches : null,
        } as Partial<Letters>);

        return this.lettersRepo.save(entity);
    }

    /**
     * ADMIN GET ALL LETTERS
     */
    async getAllLetterAdmin(req: GetAllLetterAdminRequest) {
        const page = Number(req.page) || 1;
        const pageSize = Number(req.pageSize) || 10;

        const qb = this.lettersRepo
            .createQueryBuilder('letters')
            .leftJoinAndSelect('letters.user', 'user')
            .leftJoinAndSelect('letters.match', 'match');

        if (req.userId) qb.andWhere('user.id = :userId', {userId: req.userId});
        if (req.matchId) qb.andWhere('match.id = :matchId', {matchId: req.matchId});
        if (req.mood) qb.andWhere('letters.mood = :mood', {mood: req.mood});
        if (req.search) qb.andWhere('letters.content ILIKE :search', {search: `%${req.search}%`});
        if (req.isSent !== undefined) qb.andWhere('letters.isSent = :isSent', {isSent: req.isSent});

        const sortColumn = req.sortBy?.includes('.') ? req.sortBy : `letters.${req.sortBy || 'created_at'}`;

        qb.orderBy(sortColumn, req.sortOrder ?? 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize);

        const [items, total] = await qb.getManyAndCount();

        return {items, total, page, pageSize};
    }

    /**
     * INBOX (letters user RECEIVED inside matches user is part of)
     */
    async getAllLetterReceived(userId: string, req: GetAllLetterReceivedRequest) {
        const page = Number(req.page) || 1;
        const pageSize = Number(req.pageSize) || 10;

        const qb = this.lettersRepo
            .createQueryBuilder('letters')
            .leftJoinAndSelect('letters.user', 'sender')
            .leftJoinAndSelect('letters.match', 'match')
            .leftJoinAndSelect('match.sender', 'matchSender')
            .leftJoinAndSelect('match.receiver', 'receiver')
            .where('(match.senderId = :id OR match.receiverId = :id)', {id: userId})
            .andWhere('sender.id != :id', {id: userId})
            .andWhere('letters.isSent = true');

        if (req.search) {
            qb.andWhere('sender.id = :sid', {sid: req.search});
        }
        if (req.mood) qb.andWhere('letters.mood = :mood', {mood: req.mood});

        if (req.startDate)
            qb.andWhere('letters.created_at >= :startDate', {startDate: req.startDate});
        if (req.endDate)
            qb.andWhere('letters.created_at <= :endDate', {endDate: req.endDate});

        const allowed = new Set(['created_at', 'updated_at', 'mood']);
        let sortColumn = 'letters.created_at';

        if (req.sortBy?.includes('.')) {
            sortColumn = req.sortBy; // ví dụ: sender.username
        } else if (req.sortBy && allowed.has(req.sortBy)) {
            sortColumn = `letters.${req.sortBy}`;
        }

        qb.orderBy(sortColumn, (req.sortOrder ?? 'DESC') as 'ASC' | 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize);

        const [items, total] = await qb.getManyAndCount();
        return {items, total, page, pageSize};
    }


    /**
     * SENT LETTERS (letters user CREATED)
     */
    async getAllLetterSent(userId: string, req: GetAllLetterSentRequest) {
        const page = Number(req.page) || 1;
        const pageSize = Number(req.pageSize) || 10;

        const qb = this.lettersRepo
            .createQueryBuilder('letters')
            .leftJoinAndSelect('letters.user', 'sender')            // alias sender
            .leftJoinAndSelect('letters.match', 'match')
            .leftJoinAndSelect('match.receiver', 'receiver')
            .leftJoinAndSelect('match.sender', 'matchSender')
            .where('letters.userId = :id', {id: userId})
            .andWhere('letters.isSent = true');

        if (req.search) {
            qb.andWhere('receiver.id = :receiverId', {receiverId: req.search});
        }

        if (req.mood) qb.andWhere('letters.mood = :mood', {mood: req.mood});

        if (req.startDate) {
            qb.andWhere('letters.created_at >= :startDate', {startDate: req.startDate});
        }
        if (req.endDate) {
            qb.andWhere('letters.created_at <= :endDate', {endDate: req.endDate});
        }

        const sortBy = req.sortBy?.includes('.')
            ? req.sortBy
            : `letters.${req.sortBy || 'created_at'}`;

        qb.orderBy(sortBy, req.sortOrder ?? 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize);

        const [items, total] = await qb.getManyAndCount();

        return {items, total, page, pageSize};
    }


    async getLetterByUserId(id: string): Promise<Letters | null> {
        return this.lettersRepo.findOne({
            where: {id},
            relations: ['user', 'match'],
        });
    }

    async deleteLetter(id: string): Promise<void> {
        await this.lettersRepo.delete(id);
    }

    count(options: any): Promise<number> {
        return this.lettersRepo.count(options);
    }

    async countReceivedLetters(userId: string): Promise<number> {
        return this.lettersRepo
            .createQueryBuilder('letters')
            .leftJoin('letters.match', 'match')
            .where('(match.receiverId = :userId OR match.senderId = :userId)', {userId})
            .andWhere('letters.user != :userId', {userId})
            .andWhere('letters.isSent = true')
            .getCount();
    }


    async countDistinctConnections(userId: string): Promise<number> {
        const raw = await this.lettersRepo
            .createQueryBuilder('letters')
            .select('COUNT(DISTINCT letters.match)', 'count')
            .where('letters.user = :userId', { userId })
            .getRawOne();

        return Number(raw.count);
    }
}
