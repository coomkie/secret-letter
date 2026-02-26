import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as letterRepository from '../../interfaces/repositories/letter.repository';

@Injectable()
export class DeleteLetterUseCase {
  constructor(
    @Inject('ILettersRepository')
    private readonly lettersRepository: letterRepository.ILettersRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const letter = await this.lettersRepository.getLetterByUserId(id);

    if (!letter) {
      throw new NotFoundException(`Letter with id ${id} not found`);
    }

    await this.lettersRepository.deleteLetter(id);
  }
}
