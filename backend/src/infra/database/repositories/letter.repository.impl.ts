import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, ILike} from 'typeorm';
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


    async createLetter(data: CreateLetterRequest): Promise<Letters> {
        const user = await this.usersRepo.findOne({
            where: {id: data.userId}
        });

        const match = data.matchId
            ? await this.matchesRepo.findOne({where: {id: data.matchId}})
            : null;

        const entity = this.lettersRepo.create({
            content: data.content,
            mood: data.mood,
            isSent: false,
            user,
            match,
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

        if (req.userId) qb.andWhere('user.id = :userId', {userId: req.userId});
        if (req.matchId) qb.andWhere('match.id = :matchId', {matchId: req.matchId});
        if (req.mood) qb.andWhere('letters.mood = :mood', {mood: req.mood});
        if (req.search)
            qb.andWhere('letters.content ILIKE :search', {search: `%${req.search}%`});
        if (req.isSent !== undefined)
            qb.andWhere('letters.isSent = :isSent', {isSent: req.isSent});

        const sortBy = req.sortBy ?? 'letters.createdAt';

        const sortColumn = sortBy.includes('.') ? sortBy : `letters.${sortBy}`;

        qb.orderBy(sortColumn, req.sortOrder ?? 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize);

        const [items, total] = await qb.getManyAndCount();

        return {
            items,
            total,
            page,
            pageSize,
        };
    }

    async getAllLetterReceived(userId: string, req: GetAllLetterReceivedRequest) {
        const page = Number(req.page) || 1;
        const pageSize = Number(req.pageSize) || 10;

        const qb = this.lettersRepo
            .createQueryBuilder('letters')
            .leftJoinAndSelect('letters.user', 'user')
            .leftJoinAndSelect('letters.match', 'match')
            .where('letters.isSent = true')
            .andWhere('match.receiverId = :userId', {userId});

        if (req.mood)
            qb.andWhere('letters.mood = :mood', {mood: req.mood});

        const sortBy = req.sortBy ?? 'letters.createdAt';

        const sortColumn = sortBy.includes('.') ? sortBy : `letters.${sortBy}`;

        qb.orderBy(sortColumn, req.sortOrder ?? 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize);

        const [items, total] = await qb.getManyAndCount();

        return {items, total, page, pageSize};
    }

    async getAllLetterSent(userId: string, req: GetAllLetterSentRequest) {
        const page = Number(req.page) || 1;
        const pageSize = Number(req.pageSize) || 10;

        const qb = this.lettersRepo
            .createQueryBuilder('letters')
            .leftJoinAndSelect('letters.user', 'user')
            .leftJoinAndSelect('letters.match', 'match')
            .where('letters.user.id = :userId', {userId});

        if (req.mood)
            qb.andWhere('letters.mood = :mood', {mood: req.mood});

        const sortBy = req.sortBy ?? 'letters.createdAt';

        const sortColumn = sortBy.includes('.') ? sortBy : `letters.${sortBy}`;

        qb.orderBy(sortColumn, req.sortOrder ?? 'DESC')
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
}
