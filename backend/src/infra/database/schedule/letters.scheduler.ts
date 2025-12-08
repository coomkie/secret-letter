import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Letters } from 'src/core/domain/entities/letter.entity';
import {NotificationsGateway} from "../../notification/notifications.gateway";

@Injectable()
export class LettersScheduler {
    private readonly logger = new Logger(LettersScheduler.name);

    constructor(
        @InjectRepository(Letters)
        private readonly lettersRepo: Repository<Letters>,
        private readonly ws: NotificationsGateway
    ) {}

    @Cron('0 0 7 * * *')
    async processLetters() {
        this.logger.log('Running 7AM letter send job...');

        // const lettersToSend = await this.lettersRepo.find({
        //     where: { isSent: false, sendAt: LessThanOrEqual(new Date()) },
        //     relations: ['match', 'match.sender', 'match.receiver', 'user'],
        // });

        const lettersToSend = await this.lettersRepo.find({
            where: { isSent: false },
            relations: ['match', 'match.sender', 'match.receiver', 'user'],
        });

        if (lettersToSend.length === 0) {
            this.logger.log('No pending letters to send.');
            return;
        }

        for (const letter of lettersToSend) {
            letter.isSent = true;
            await this.lettersRepo.save(letter);

            // Xác định người nhận
            const receiver = letter.user.id === letter.match.sender.id
                ? letter.match.receiver
                : letter.match.sender;

            // Gửi WS
            this.ws.sendNotification(receiver.id, 'You have a new letter!');
        }

        this.logger.log(`Sent ${lettersToSend.length} letter(s).`);
    }
}
