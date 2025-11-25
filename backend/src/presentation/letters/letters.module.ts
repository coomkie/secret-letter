import {Module} from '@nestjs/common';
import {LettersController} from './letters.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Letters} from "../../core/domain/entities/letter.entity";
import {Users} from "../../core/domain/entities/user.entity";
import {Matches} from "../../core/domain/entities/match.entity";
import {CreateLetterUseCase} from "../../core/application/use-cases/letters/create-letter.usecase";
import {DeleteLetterUseCase} from "../../core/application/use-cases/letters/delete-letter.usecase";
import {GetAllLetterAdminUseCase} from "../../core/application/use-cases/letters/get-all-letter-admin.usecase";
import {GetAllLetterReceivedUseCase} from "../../core/application/use-cases/letters/get-all-letter-received.usecase";
import {GetAllLetterSentUseCase} from "../../core/application/use-cases/letters/get-all-letter-sent.usecase";
import {GetLetterByUserIdUseCase} from "../../core/application/use-cases/letters/get-letter-by-userId.usecase";
import {LettersRepositoryImpl} from "../../infra/database/repositories/letter.repository.impl";

@Module({
    imports: [
        TypeOrmModule.forFeature([Letters, Users, Matches])
    ],
    controllers: [LettersController],
    providers: [
        CreateLetterUseCase,
        DeleteLetterUseCase,
        GetAllLetterAdminUseCase,
        GetAllLetterReceivedUseCase,
        GetAllLetterSentUseCase,
        GetLetterByUserIdUseCase,
        {
            provide: 'ILettersRepository',
            useClass: LettersRepositoryImpl,
        }
    ],
    exports: [
        CreateLetterUseCase,
        DeleteLetterUseCase,
        GetAllLetterAdminUseCase,
        GetAllLetterReceivedUseCase,
        GetAllLetterSentUseCase,
        GetLetterByUserIdUseCase,
        'ILettersRepository'
    ]
})
export class LettersModule {
}
