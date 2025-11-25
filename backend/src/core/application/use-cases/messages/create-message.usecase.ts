import {Injectable, Inject} from '@nestjs/common';
import {CreateMessageRequest} from '../../dtos/messages/request/create-message-request';
import {Messages} from '../../../domain/entities/message.entity';
import * as messageRepository from "../../interfaces/repositories/message.repository";

@Injectable()
export class CreateMessageUseCase {
    constructor(
        @Inject('IMessagesRepository')
        private readonly messagesRepo: messageRepository.IMessagesRepository,
    ) {
    }

    async execute(matchId: string, senderId: string, data: CreateMessageRequest): Promise<Messages> {
        return await this.messagesRepo.createMessage(matchId, senderId, data);
    }
}
