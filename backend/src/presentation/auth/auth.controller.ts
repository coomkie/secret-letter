import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {LoginUseCase} from "../../core/application/use-cases/auth/login-usecase";
import {LoginRequest} from "../../core/application/dtos/auth/request/login-request";
import {RegisterRequest} from "../../core/application/dtos/auth/request/register-request";
import {RegisterUseCase} from "../../core/application/use-cases/auth/register-usecase";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../infra/auth/jwt-auth.guard";
import {MeUseCase} from "../../core/application/use-cases/auth/me-usecase";

@ApiTags('Authentication')
@ApiBearerAuth('jwt')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly registerUseCase: RegisterUseCase,
        private readonly meUseCase: MeUseCase
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@Req() req: any) {
        const userId = req.user.userId;
        return this.meUseCase.execute(userId);
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
