import { Injectable, Inject } from '@nestjs/common';
import { Matches } from '../../../domain/entities/match.entity';
import * as matchRepository from '../../interfaces/repositories/match.repository';
import { GetAllMatchUserRequest } from '../../dtos/matches/request/get-all-match-request';

@Injectable()
export class GetAllMatchUserUseCase {
  constructor(
    @Inject('IMatchesRepository')
    private readonly matchesRepository: matchRepository.IMatchesRepository,
  ) {}

  async execute(
    userId: string,
    req: GetAllMatchUserRequest,
  ): Promise<{
    items: Matches[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const page = Number(req.page) || 1;
    const pageSize = Number(req.pageSize) || 10;

    const result = await this.matchesRepository.getAllMatch(userId, req);

    return {
      items: result.items,
      total: result.total,
      page,
      pageSize,
    };
  }
}
