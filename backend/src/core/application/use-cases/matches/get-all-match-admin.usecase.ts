import { Injectable, Inject } from '@nestjs/common';
import { Matches } from '../../../domain/entities/match.entity';
import { GetAllMatchAdminRequest } from '../../dtos/matches/request/get-all-match-admin-request';
import * as matchRepository from '../../interfaces/repositories/match.repository';

@Injectable()
export class GetAllMatchAdminUseCase {
  constructor(
    @Inject('IMatchesRepository')
    private readonly matchesRepository: matchRepository.IMatchesRepository,
  ) {}

  async execute(req: GetAllMatchAdminRequest): Promise<{
    items: Matches[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const page = Number(req.page) || 1;
    const pageSize = Number(req.pageSize) || 10;

    const result = await this.matchesRepository.getAllMatchAdmin(req);

    return {
      items: result.items,
      total: result.total,
      page,
      pageSize,
    };
  }
}
