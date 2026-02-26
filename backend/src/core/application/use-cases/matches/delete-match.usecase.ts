import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as matchRepository from '../../interfaces/repositories/match.repository';

@Injectable()
export class DeleteMatchUseCase {
  constructor(
    @Inject('IMatchesRepository')
    private readonly matchesRepository: matchRepository.IMatchesRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const match = await this.matchesRepository.getMatchById(id);
    if (!match) {
      throw new NotFoundException(`Match with id ${id} not found`);
    }

    await this.matchesRepository.deleteMatch(id);
  }
}
