import { Matches } from '../../../domain/entities/match.entity';
import { CreateMatchRequest } from '../../dtos/matches/request/create-match-request';
import { GetAllMatchAdminRequest } from '../../dtos/matches/request/get-all-match-admin-request';
import { GetAllMatchUserRequest } from '../../dtos/matches/request/get-all-match-request';

export interface IMatchesRepository {
  createMatch(data: CreateMatchRequest): Promise<Matches>;

  getAllMatchAdmin(req: GetAllMatchAdminRequest): Promise<{
    items: Matches[];
    total: number;
    page: number;
    pageSize: number;
  }>;

  getAllMatch(
    userId: string,
    req: GetAllMatchUserRequest,
  ): Promise<{
    items: Matches[];
    total: number;
    page: number;
    pageSize: number;
  }>;

  getMatchById(id: string): Promise<Matches | null>;

  deleteMatch(id: string): Promise<void>;

  count(options: any): Promise<number>;
}
