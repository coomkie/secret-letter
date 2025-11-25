import {Injectable, Inject} from '@nestjs/common';
import * as messageRepository from "../../interfaces/repositories/message.repository";

@Injectable()
export class IsUserInMatchUseCase {
    constructor(
        @Inject('IMessagesRepository')
        private readonly messagesRepo: messageRepository.IMessagesRepository,
    ) {
    }

    async execute(matchId: string, userId: string): Promise<boolean> {
        return this.messagesRepo.isUserInMatch(matchId, userId);
    }
}
