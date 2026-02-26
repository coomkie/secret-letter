import { Injectable, Inject } from '@nestjs/common';
import * as letterRepository from '../../interfaces/repositories/letter.repository';

@Injectable()
export class CheckReplyUseCase {
  constructor(
    @Inject('ILettersRepository')
    private readonly lettersRepo: letterRepository.ILettersRepository,
  ) {}

  async execute(letterId: string) {
    return await this.lettersRepo.checkReply(letterId);
  }
}
