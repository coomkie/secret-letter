import { UserShortResponse } from './user-short-response';

export class PaginationUserResponse {
  items: UserShortResponse[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}
