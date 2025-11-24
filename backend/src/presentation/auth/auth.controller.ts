import {Body, Controller, Post} from '@nestjs/common';
import {LoginUseCase} from "../../core/application/use-cases/auth/login-usecase";
import {LoginRequest} from "../../core/application/dtos/auth/request/login-request";
import {RegisterRequest} from "../../core/application/dtos/auth/request/register-request";
import {RegisterUseCase} from "../../core/application/use-cases/auth/register-usecase";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly registerUseCase: RegisterUseCase,
    ) {
    }

    @Post('login')
    async login(@Body() body: LoginRequest) {
        return this.loginUseCase.execute(body);
    }

    @Post('register')
    async register(@Body() body: RegisterRequest) {
        return this.registerUseCase.execute(body);
    }
}
