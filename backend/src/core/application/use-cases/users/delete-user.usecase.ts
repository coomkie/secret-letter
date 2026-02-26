import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as userRepository from '../../interfaces/repositories/user.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('IUsersRepository')
    private readonly usersRepository: userRepository.IUsersRepository,
  ) {}

  async execute(id: string) {
    const user = await this.usersRepository.getUserById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    await this.usersRepository.deleteUser(id);
  }
}
