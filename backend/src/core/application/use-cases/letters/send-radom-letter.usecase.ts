import * as letterRepository from "../../interfaces/repositories/letter.repository";
import {HttpStatus, Inject, Injectable} from "@nestjs/common";
import {SendRandomLetterRequest} from "../../dtos/letters/request/send-letter-random-request";
import {NotificationsGateway} from "../../../../infra/notification/notifications.gateway";

@Injectable()
export class SendRandomLetterUseCase {
    constructor(
        private readonly notificationsGateway: NotificationsGateway,

        @Inject('ILettersRepository')
        private readonly lettersRepo: letterRepository.ILettersRepository,
    ) {
    }

    async execute(senderId: string, data: SendRandomLetterRequest) {
        const letter = await this.lettersRepo.createRandomLetter(senderId, data);

        // gửi notification tới receiver
        const receiverId = letter.match.receiver.id;
        this.notificationsGateway.sendNotification(
            receiverId,
            'new inbox coming..'
        );

        return letter;
    }
}
