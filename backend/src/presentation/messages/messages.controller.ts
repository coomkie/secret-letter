import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    UseGuards,
    Request,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import {CreateMessageRequest} from '../../core/application/dtos/messages/request/create-message-request';
import {MessagesResponse} from '../../core/application/dtos/messages/response/message-response';
import {CreateMessageUseCase} from '../../core/application/use-cases/messages/create-message.usecase';
import {IsUserInMatchUseCase} from '../../core/application/use-cases/messages/is-user-in-match.usecase';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {RolesGuard} from "../../infra/auth/roles.guard";
import {GetMessagesByMatchIdUseCase} from "../../core/application/use-cases/messages/get-message-by-matchId.usecase";
import {JwtAuthGuard} from "../../infra/auth/jwt-auth.guard";

@ApiTags('Messages')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('messages')
export class MessagesController {
    constructor(
        private readonly createMessageUseCase: CreateMessageUseCase,
        private readonly getMessagesByMatchIdUseCase: GetMessagesByMatchIdUseCase,
        private readonly isUserInMatchUseCase: IsUserInMatchUseCase,
    ) {
    }

    @Post(':matchId')
    async createMessage(
        @Param('matchId') matchId: string,
        @Body() body: CreateMessageRequest,
        @Request() req: any,
    ) {
        const userId = req.user.userId;

        const isInMatch = await this.isUserInMatchUseCase.execute(matchId, userId);
        if (!isInMatch) throw new UnauthorizedException('User is not part of this match');

        const message = await this.createMessageUseCase.execute(matchId, userId, body);
        return new MessagesResponse(message);
    }

    @Get(':matchId')
    async getMessages(
        @Param('matchId') matchId: string,
        @Request() req: any,
    ) {
        const userId = req.user.userId;

        const isInMatch = await this.isUserInMatchUseCase.execute(matchId, userId);
        if (!isInMatch) throw new UnauthorizedException('User is not part of this match');

        const messages = await this.getMessagesByMatchIdUseCase.execute(matchId);
        return messages.map(msg => new MessagesResponse(msg));
    }
}
