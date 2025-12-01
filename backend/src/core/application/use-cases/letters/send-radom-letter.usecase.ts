import * as letterRepository from "../../interfaces/repositories/letter.repository";
import {HttpStatus, Inject, Injectable} from "@nestjs/common";
import {SendRandomLetterRequest} from "../../dtos/letters/request/send-letter-random-request";

@Injectable()
export class SendRandomLetterUseCase {
    constructor(
        @Inject('ILettersRepository')
        private readonly lettersRepo: letterRepository.ILettersRepository,
    ) {
    }

    async execute(userId: string, dto: SendRandomLetterRequest) {
        await this.lettersRepo.createRandomLetter(userId, dto);
        return HttpStatus.OK;
    }
}
