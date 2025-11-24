import {Inject, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import * as userRepository from "../../interfaces/repositories/user.repository";
import * as authService from "../../interfaces/services/auth.service";
import {LoginRequest} from "../../dtos/auth/request/login-request";
import {LoginResponse} from "../../dtos/auth/response/login-response";

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject('IUsersRepository')
        private readonly _userRepository: userRepository.IUsersRepository,
        @Inject('IAuthService')
        private readonly _authService: authService.IAuthService,
    ) {
    }

    async execute(data: LoginRequest): Promise<LoginResponse> {
        const user = await this._userRepository.getUserByEmail(data.email);
        if (!user) throw new NotFoundException('Invalid email or password-');

        const hashedPassword = this._authService.hashPassword(data.password);
        if (hashedPassword !== user.password)
            throw new UnauthorizedException('Invalid email or password');

        const token = this._authService.generateToken({
            sub: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
        });

        return new LoginResponse(token);
    }
}