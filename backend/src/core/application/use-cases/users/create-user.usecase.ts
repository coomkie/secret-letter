import {BadRequestException, HttpException, HttpStatus, Inject, Injectable, NotFoundException} from "@nestjs/common";
import * as userRepository from "../../../application/interfaces/repositories/user.repository";

import {CreateUserRequest} from "../../dtos/users/request/create-user-request";
import {AuthService} from "../../../../presentation/auth/auth.service";

@Injectable()
export class CreateUserUseCase {
    constructor(
        @Inject('IUsersRepository')
        private readonly _userRepository: userRepository.IUsersRepository,
        @Inject('IAuthService')
        private readonly authService: AuthService,
    ) {
    }

    async execute(data: Partial<CreateUserRequest>) {
        if (!data.email) {
            throw new HttpException("Email cannot null", HttpStatus.BAD_REQUEST);
        }
        const existUser = await this._userRepository.getUserByEmail(data.email);
        if (existUser) throw new NotFoundException(`Email ${existUser.email} already exists`);
        if (!data.password) throw new BadRequestException('Password is required');

        const hashedPassword = this.authService.hashPassword(data.password);
        return this._userRepository.createUser({
            ...data,
            password: hashedPassword,
        });
    }
}