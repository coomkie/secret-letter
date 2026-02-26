import * as letterRepository from '../../interfaces/repositories/letter.repository';
import { ReplyLetterRequest } from '../../dtos/letters/request/reply-letter.-request';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { NotificationsGateway } from '../../../../infra/notification/notifications.gateway';

@Injectable()
export class ReplyLetterUseCase {
  constructor(
    private readonly notificationsGateway: NotificationsGateway,

    @Inject('ILettersRepository')
    private readonly lettersRepo: letterRepository.ILettersRepository,
  ) {}

  async execute(senderId: string, data: ReplyLetterRequest) {
    const letter = await this.lettersRepo.replyLetter(senderId, data);

    const match = letter.match;
    const receiverId =
      match.sender.id === senderId ? match.receiver.id : match.sender.id;

    this.notificationsGateway.sendNotification(
      receiverId,
      'New reply coming..',
    );

    return letter;
  }
}
