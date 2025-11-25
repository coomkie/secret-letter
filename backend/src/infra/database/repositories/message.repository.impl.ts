import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {IMessagesRepository} from "../../../core/application/interfaces/repositories/message.repository";
import {Messages} from "../../../core/domain/entities/message.entity";
import {Matches} from "../../../core/domain/entities/match.entity";
import {Users} from "../../../core/domain/entities/user.entity";
import {CreateMessageRequest} from "../../../core/application/dtos/messages/request/create-message-request";

@Injectable()
export class MessagesRepositoryImpl implements IMessagesRepository {
    constructor(
        @InjectRepository(Messages)
        private readonly messagesRepo: Repository<Messages>,
        @InjectRepository(Matches)
        private readonly matchesRepo: Repository<Matches>,
        @InjectRepository(Users)
        private readonly usersRepo: Repository<Users>,
    ) {
    }

    async createMessage(matchId: string, senderId: string, data: CreateMessageRequest): Promise<Messages> {
        const match = await this.matchesRepo.findOne({
            where: {id: matchId},
            relations: ['sender', 'receiver'],
        });
        if (!match) throw new NotFoundException(`Match with id ${matchId} not found`);

        if (match.sender.id !== senderId && match.receiver.id !== senderId) {
            throw new UnauthorizedException('User is not part of this match');
        }

        const sender = await this.usersRepo.findOne({where: {id: senderId}});
        if (!sender) throw new NotFoundException(`Sender with id ${senderId} not found`);

        const message = this.messagesRepo.create({
            match,
            sender,
            content: data.content,
        });

        return this.messagesRepo.save(message);
    }

    async getMessagesByMatchId(matchId: string): Promise<Messages[]> {
        const match = await this.matchesRepo.findOne({where: {id: matchId}});
        if (!match) throw new NotFoundException(`Match with id ${matchId} not found`);

        return this.messagesRepo.find({
            where: {match: {id: matchId}},
            relations: ['sender', 'match'],
            order: {created_at: 'ASC'},
        });
    }

    async isUserInMatch(matchId: string, userId: string): Promise<boolean> {
        const match = await this.matchesRepo.findOne({
            where: {id: matchId},
            relations: ['sender', 'receiver'],
        });
        if (!match) return false;
        return match.sender.id === userId || match.receiver.id === userId;
    }
}
