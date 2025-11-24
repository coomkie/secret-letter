import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Users} from "../../core/domain/entities/user.entity";
import {JwtModule, JwtModuleOptions} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {AuthController} from "./auth.controller";
import {LoginUseCase} from "../../core/application/use-cases/auth/login-usecase";
import {JwtStrategy} from "../../infra/auth/jwt.strategy";
import {AuthServiceImpl} from "../../infra/auth/auth.service.impl";
import {UsersModule} from "../users/users.module";
import {RegisterUseCase} from "../../core/application/use-cases/auth/register-usecase";

@Module({
    imports: [
        TypeOrmModule.forFeature([Users]),
        forwardRef(() => UsersModule),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService): JwtModuleOptions => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: config.get('JWT_EXPIRES_IN')
                },
            }),
        })],
    controllers: [AuthController],
    providers: [
        LoginUseCase,
        RegisterUseCase,
        JwtStrategy,
        {
            provide: 'IAuthService',
            useClass: AuthServiceImpl,
        },
    ],
    exports: [LoginUseCase,RegisterUseCase, 'IAuthService'],
})
export class AuthModule {
}
