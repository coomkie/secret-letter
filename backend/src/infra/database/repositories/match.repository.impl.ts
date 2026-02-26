import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMatchesRepository } from '../../../core/application/interfaces/repositories/match.repository';
import { Matches } from '../../../core/domain/entities/match.entity';
import { Users } from '../../../core/domain/entities/user.entity';
import { CreateMatchRequest } from '../../../core/application/dtos/matches/request/create-match-request';
import { MatchStatus } from '../../../core/domain/enums/match-status.enum';
import { GetAllMatchAdminRequest } from '../../../core/application/dtos/matches/request/get-all-match-admin-request';
import { GetAllMatchUserRequest } from '../../../core/application/dtos/matches/request/get-all-match-request';

@Injectable()
export class MatchesRepositoryImpl implements IMatchesRepository {
  constructor(
    @InjectRepository(Matches)
    private readonly matchesRepo: Repository<Matches>,
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
  ) {}

  count(options: any): Promise<number> {
    return this.matchesRepo.count(options);
  }

  async createMatch(data: CreateMatchRequest): Promise<Matches> {
    const sender = await this.usersRepo.findOne({
      where: { id: data.senderId },
    });
    const receiver = await this.usersRepo.findOne({
      where: { id: data.receiverId },
    });

    if (!sender) throw new Error(`Sender with id ${data.senderId} not found`);
    if (!receiver)
      throw new Error(`Receiver with id ${data.receiverId} not found`);

    const match = this.matchesRepo.create({
      sender,
      receiver,
      status: MatchStatus.OPEN,
    });

    return this.matchesRepo.save(match);
  }

  async getAllMatchAdmin(req: GetAllMatchAdminRequest) {
    const page = Number(req.page) || 1;
    const pageSize = Number(req.pageSize) || 10;

    const qb = this.matchesRepo
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.sender', 'sender')
      .leftJoinAndSelect('match.receiver', 'receiver')
      .leftJoinAndSelect('match.letter', 'letter')
      .leftJoinAndSelect('match.messages', 'messages');

    if (req.senderId)
      qb.andWhere('sender.id = :senderId', { senderId: req.senderId });
    if (req.receiverId)
      qb.andWhere('receiver.id = :receiverId', { receiverId: req.receiverId });

    qb.orderBy(req.sortBy ?? 'match.created_at', req.sortOrder ?? 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [items, total] = await qb.getManyAndCount();

    return { items, total, page, pageSize };
  }

  async getAllMatch(userId: string, req: GetAllMatchUserRequest) {
    const page = Number(req.page) || 1;
    const pageSize = Number(req.pageSize) || 10;

    const qb = this.matchesRepo
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.sender', 'sender')
      .leftJoinAndSelect('match.receiver', 'receiver')
      .leftJoinAndSelect('match.letter', 'letter')
      .leftJoinAndSelect('match.messages', 'messages')
      .where('sender.id = :userId OR receiver.id = :userId', { userId });

    if (req.status)
      qb.andWhere('match.status = :status', { status: req.status });

    qb.orderBy(req.sortBy ?? 'match.created_at', req.sortOrder ?? 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [items, total] = await qb.getManyAndCount();

    return { items, total, page, pageSize };
  }

  async getMatchById(id: string): Promise<Matches | null> {
    return this.matchesRepo.findOne({
      where: { id },
      relations: ['sender', 'receiver', 'letter', 'messages'],
    });
  }

  async deleteMatch(id: string): Promise<void> {
    await this.matchesRepo.delete(id);
  }
}
