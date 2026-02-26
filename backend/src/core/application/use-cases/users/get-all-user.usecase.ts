import { Inject, Injectable } from '@nestjs/common';
import * as userRepository from '../../interfaces/repositories/user.repository';
import { PaginationUserResponse } from '../../dtos/users/response/pagination-user-response';
import { UserShortResponse } from '../../dtos/users/response/user-short-response';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject('IUsersRepository')
    private readonly usersRepository: userRepository.IUsersRepository,
  ) {}

  async execute(options): Promise<PaginationUserResponse> {
    const [entities, totalItems] =
      await this.usersRepository.getAllUsers(options);
    const items = entities.map((e) => new UserShortResponse(e));
    const totalPages = Math.ceil(totalItems / (options.pageSize || 10));

    return {
      items,
      totalItems,
      currentPage: options.page || 1,
      pageSize: options.pageSize || 10,
      totalPages,
    };
  }
}
