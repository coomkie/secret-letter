import { Inject, Injectable } from '@nestjs/common';
import { GetAllLetterAdminRequest } from '../../dtos/letters/request/get-all-letter-admin-request';
import { LettersResponse } from '../../dtos/letters/response/letter-response';
import * as letterRepository from '../../interfaces/repositories/letter.repository';

@Injectable()
export class GetAllLetterAdminUseCase {
  constructor(
    @Inject('ILettersRepository')
    private readonly lettersRepository: letterRepository.ILettersRepository,
  ) {}

  async execute(req: GetAllLetterAdminRequest): Promise<{
    items: LettersResponse[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const { items, total, page, pageSize } =
      await this.lettersRepository.getAllLetterAdmin(req);

    return {
      items: items.map((item) => new LettersResponse(item)),
      total,
      page,
      pageSize,
    };
  }
}
