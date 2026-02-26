import { Inject, Injectable } from '@nestjs/common';
import { GetAllLetterSentRequest } from '../../dtos/letters/request/get-all-letter-sent-request';
import { LettersResponse } from '../../dtos/letters/response/letter-response';
import * as letterRepository from '../../interfaces/repositories/letter.repository';
import { LetterSendResponse } from '../../dtos/letters/response/letter-send-response';

@Injectable()
export class GetAllLetterSentUseCase {
  constructor(
    @Inject('ILettersRepository')
    private readonly lettersRepository: letterRepository.ILettersRepository,
  ) {}

  async execute(
    userId: string,
    req: GetAllLetterSentRequest,
  ): Promise<{
    items: LetterSendResponse[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const { items, total, page, pageSize } =
      await this.lettersRepository.getAllLetterSent(userId, req);

    return {
      items: items.map((item) => new LetterSendResponse(item, userId)),
      total,
      page,
      pageSize,
    };
  }
}
