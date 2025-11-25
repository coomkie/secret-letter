import { Injectable, Inject } from '@nestjs/common';
import { Messages } from '../../../domain/entities/message.entity';
import * as messageRepository from "../../interfaces/repositories/message.repository";

@Injectable()
export class GetMessagesByMatchIdUseCase {
    constructor(
        @Inject('IMessagesRepository')
        private readonly messagesRepo: messageRepository.IMessagesRepository,
    ) {}

    async execute(matchId: string): Promise<Messages[]> {
        return await this.messagesRepo.getMessagesByMatchId(matchId);
    }
}
