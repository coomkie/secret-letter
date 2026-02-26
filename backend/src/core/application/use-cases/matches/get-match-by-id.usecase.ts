import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Matches } from '../../../domain/entities/match.entity';
import * as matchRepository from '../../interfaces/repositories/match.repository';

@Injectable()
export class GetMatchByIdUseCase {
  constructor(
    @Inject('IMatchesRepository')
    private readonly matchesRepository: matchRepository.IMatchesRepository,
  ) {}

  async execute(id: string): Promise<Matches> {
    const match = await this.matchesRepository.getMatchById(id);

    if (!match) {
      throw new NotFoundException(`Match with id ${id} not found`);
    }

    return match;
  }
}
