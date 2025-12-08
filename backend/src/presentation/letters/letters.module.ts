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
import {SendRandomLetterUseCase} from "../../core/application/use-cases/letters/send-radom-letter.usecase";
import {ReplyLetterUseCase} from "../../core/application/use-cases/letters/reply-letter.usecase";
import {NotificationsModule} from "../notifications/notifications.module";
import {GetUnreadCountUseCase} from "../../core/application/use-cases/letters/get-unread-count.usecase";
import {MarkAsReadUseCase} from "../../core/application/use-cases/letters/mark-as-read.usecase";
import {CheckReplyUseCase} from "../../core/application/use-cases/letters/check-reply.usecase";
import {LettersScheduler} from "../../infra/database/schedule/letters.scheduler";
import {Reports} from "../../core/domain/entities/report.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Letters, Users, Matches, Reports]),
        NotificationsModule,
    ],
    controllers: [LettersController],
    providers: [
        CreateLetterUseCase,
        SendRandomLetterUseCase,
        ReplyLetterUseCase,
        DeleteLetterUseCase,
        GetAllLetterAdminUseCase,
        GetAllLetterReceivedUseCase,
        GetAllLetterSentUseCase,
        GetLetterByUserIdUseCase,
        GetUnreadCountUseCase,
        MarkAsReadUseCase,
        CheckReplyUseCase,
        LettersScheduler,
        {
            provide: 'ILettersRepository',
            useClass: LettersRepositoryImpl,
        }
    ],
    exports: [
        CreateLetterUseCase,
        SendRandomLetterUseCase,
        ReplyLetterUseCase,
        DeleteLetterUseCase,
        GetAllLetterAdminUseCase,
        GetAllLetterReceivedUseCase,
        GetAllLetterSentUseCase,
        GetLetterByUserIdUseCase,
        GetUnreadCountUseCase,
        MarkAsReadUseCase,
        CheckReplyUseCase,
        'ILettersRepository'
    ]
})
export class LettersModule {
}
