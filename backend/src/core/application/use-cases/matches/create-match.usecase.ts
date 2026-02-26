import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { Matches } from '../../../domain/entities/match.entity';
import { CreateMatchRequest } from '../../dtos/matches/request/create-match-request';
import * as matchRepository from '../../interfaces/repositories/match.repository';

@Injectable()
export class CreateMatchUseCase {
  constructor(
    @Inject('IMatchesRepository')
    private readonly matchesRepository: matchRepository.IMatchesRepository,
  ) {}

  async execute(data: CreateMatchRequest): Promise<Matches> {
    if (data.senderId === data.receiverId) {
      throw new BadRequestException(
        'Sender and receiver cannot be the same user.',
      );
    }

    const match = await this.matchesRepository.createMatch(data);

    if (!match) {
      throw new NotFoundException(
        'Failed to create match. Users may not exist.',
      );
    }

    return match;
  }
}
