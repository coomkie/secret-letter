import * as letterRepository from "../../interfaces/repositories/letter.repository";
import {ReplyLetterRequest} from "../../dtos/letters/request/reply-letter.-request";
import {HttpStatus, Inject, Injectable} from "@nestjs/common";

@Injectable()
export class ReplyLetterUseCase {
    constructor(
        @Inject('ILettersRepository')
        private readonly lettersRepo: letterRepository.ILettersRepository,
    ) {
    }

    async execute(userId: string, dto: ReplyLetterRequest) {
        await this.lettersRepo.replyLetter(userId, dto);
        return HttpStatus.OK;
    }
}
