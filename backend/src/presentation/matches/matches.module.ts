import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesController } from './matches.controller';
import { Matches } from '../../core/domain/entities/match.entity';
import { Messages } from '../../core/domain/entities/message.entity';
import { Users } from '../../core/domain/entities/user.entity';
import { Letters } from '../../core/domain/entities/letter.entity';
import { CreateMatchUseCase } from '../../core/application/use-cases/matches/create-match.usecase';
import { GetAllMatchAdminUseCase } from '../../core/application/use-cases/matches/get-all-match-admin.usecase';
import { GetMatchByIdUseCase } from '../../core/application/use-cases/matches/get-match-by-id.usecase';
import { DeleteMatchUseCase } from '../../core/application/use-cases/matches/delete-match.usecase';
import { MatchesRepositoryImpl } from '../../infra/database/repositories/match.repository.impl';
import {GetAllMatchUserUseCase} from "../../core/application/use-cases/matches/get-all-match.usecase";

@Module({
    imports: [TypeOrmModule.forFeature([Matches, Users, Letters, Messages])],
    controllers: [MatchesController],
    providers: [
        CreateMatchUseCase,
        GetAllMatchAdminUseCase,
        GetAllMatchUserUseCase,
        GetMatchByIdUseCase,
        DeleteMatchUseCase,
        {
            provide: 'IMatchesRepository',
            useClass: MatchesRepositoryImpl,
        },
    ],
    exports: [
        CreateMatchUseCase,
        GetAllMatchAdminUseCase,
        GetAllMatchUserUseCase,
        GetMatchByIdUseCase,
        DeleteMatchUseCase,
        'IMatchesRepository',
    ],
})
export class MatchesModule {}
