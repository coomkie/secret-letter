import {
  Inject,
  Injectable,
  ConflictException,
  HttpStatus,
} from '@nestjs/common';
import * as userRepository from '../../interfaces/repositories/user.repository';
import * as authService from '../../interfaces/services/auth.service';
import { RegisterRequest } from '../../dtos/auth/request/register-request';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('IUsersRepository')
    private readonly _userRepository: userRepository.IUsersRepository,
    @Inject('IAuthService')
    private readonly _authService: authService.IAuthService,
  ) {}

  async execute(data: RegisterRequest): Promise<HttpStatus> {
    const existingUser = await this._userRepository.getUserByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = this._authService.hashPassword(data.password);
    const newUser = await this._userRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    const token = this._authService.generateToken({
      sub: newUser.id,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });

    return HttpStatus.NO_CONTENT;
  }
}
