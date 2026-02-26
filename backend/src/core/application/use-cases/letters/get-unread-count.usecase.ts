import { Injectable, Inject } from '@nestjs/common';
import * as letterRepository from '../../interfaces/repositories/letter.repository';

@Injectable()
export class GetUnreadCountUseCase {
  constructor(
    @Inject('ILettersRepository')
    private readonly lettersRepo: letterRepository.ILettersRepository,
  ) {}

  async execute(userId: string): Promise<number> {
    return await this.lettersRepo.countUnreadLetters(userId);
  }
}
