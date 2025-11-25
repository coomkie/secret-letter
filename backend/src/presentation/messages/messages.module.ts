import {Module} from '@nestjs/common';
import {MessagesController} from './messages.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Messages} from '../../core/domain/entities/message.entity';
import {Matches} from '../../core/domain/entities/match.entity';
import {Users} from '../../core/domain/entities/user.entity';
import {MessagesRepositoryImpl} from '../../infra/database/repositories/message.repository.impl';
import {CreateMessageUseCase} from '../../core/application/use-cases/messages/create-message.usecase';
import {IsUserInMatchUseCase} from '../../core/application/use-cases/messages/is-user-in-match.usecase';
import {GetMessagesByMatchIdUseCase} from "../../core/application/use-cases/messages/get-message-by-matchId.usecase";

@Module({
    imports: [
        TypeOrmModule.forFeature([Messages, Matches, Users]),
    ],
    controllers: [MessagesController],
    providers: [
        CreateMessageUseCase,
        GetMessagesByMatchIdUseCase,
        IsUserInMatchUseCase,
        {
            provide: 'IMessagesRepository',
            useClass: MessagesRepositoryImpl,
        },
    ],
    exports: [
        CreateMessageUseCase,
        GetMessagesByMatchIdUseCase,
        IsUserInMatchUseCase,
        'IMessagesRepository',
    ],
})
export class MessagesModule {
}
