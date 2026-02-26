import { Injectable, Inject } from '@nestjs/common';
import * as letterRepository from '../../interfaces/repositories/letter.repository';

@Injectable()
export class MarkAsReadUseCase {
  constructor(
    @Inject('ILettersRepository')
    private readonly lettersRepo: letterRepository.ILettersRepository,
  ) {}

  async execute(letterId: string, userId: string): Promise<void> {
    await this.lettersRepo.markAsRead(letterId, userId);
  }
}
