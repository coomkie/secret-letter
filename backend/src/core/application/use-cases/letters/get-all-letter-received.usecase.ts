import { Inject, Injectable } from '@nestjs/common';
import { GetAllLetterReceivedRequest } from '../../dtos/letters/request/get-all-letter-received-request';
import { LettersResponse } from '../../dtos/letters/response/letter-response';
import * as letterRepository from "../../interfaces/repositories/letter.repository";

@Injectable()
export class GetAllLetterReceivedUseCase {
    constructor(
        @Inject('ILettersRepository')
        private readonly lettersRepository: letterRepository.ILettersRepository,
    ) {}

    async execute(userId: string, req: GetAllLetterReceivedRequest): Promise<{
        items: LettersResponse[];
        total: number;
        page: number;
        pageSize: number;
    }> {
        const { items, total, page, pageSize } = await this.lettersRepository.getAllLetterReceived(userId, req);

        return {
            items: items.map(item => new LettersResponse(item)),
            total,
            page,
            pageSize,
        };
    }
}
