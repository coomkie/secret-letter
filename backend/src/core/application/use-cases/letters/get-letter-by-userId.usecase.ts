import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LettersResponse } from '../../dtos/letters/response/letter-response';
import * as letterRepository from '../../interfaces/repositories/letter.repository';

@Injectable()
export class GetLetterByUserIdUseCase {
  constructor(
    @Inject('ILettersRepository')
    private readonly lettersRepository: letterRepository.ILettersRepository,
  ) {}

  async execute(id: string): Promise<LettersResponse> {
    const letter = await this.lettersRepository.getLetterByUserId(id);

    if (!letter) {
      throw new NotFoundException(`Letter with id ${id} not found`);
    }

    return new LettersResponse(letter);
  }
}
