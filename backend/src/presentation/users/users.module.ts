import {forwardRef, Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Users} from "../../core/domain/entities/user.entity";
import {AuthModule} from "../auth/auth.module";
import {CreateUserUseCase} from "../../core/application/use-cases/users/create-user.usecase";
import {UsersRepositoryImpl} from "../../infra/database/repositories/user.repository.impl";
import {UserSettings} from "../../core/domain/entities/user-setting.entity";
import {Letters} from "../../core/domain/entities/letter.entity";
import {Reports} from "../../core/domain/entities/report.entity";
import {Matches} from "../../core/domain/entities/match.entity";
import {Messages} from "../../core/domain/entities/message.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Users, UserSettings, Letters, Matches, Reports, Messages]),
        forwardRef(() => AuthModule),
    ],
    controllers: [UsersController],
    providers: [
        CreateUserUseCase,
        {
            provide: 'IUsersRepository',
            useClass: UsersRepositoryImpl,
        }
    ],
    exports: [
        CreateUserUseCase,
        'IUsersRepository',
    ]
})
export class UsersModule {
}
