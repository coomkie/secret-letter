import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLetterRequest } from '../../dtos/letters/request/create-letter-request';
import { LettersResponse } from '../../dtos/letters/response/letter-response';
import * as letterRepository from '../../interfaces/repositories/letter.repository';

@Injectable()
export class CreateLetterUseCase {
  constructor(
    @Inject('ILettersRepository')
    private readonly lettersRepository: letterRepository.ILettersRepository,
  ) {}

  async execute(data: CreateLetterRequest): Promise<LettersResponse> {
    const letter = await this.lettersRepository.createLetter(data);

    if (!letter) {
      throw new NotFoundException('Failed to create letter');
    }

    return new LettersResponse(letter);
  }
}
