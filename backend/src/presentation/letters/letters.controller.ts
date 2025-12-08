import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Query,
    Body,
    UseGuards,
    Request, Patch, Req,
} from '@nestjs/common';
import {CreateLetterRequest} from '../../core/application/dtos/letters/request/create-letter-request';
import {GetAllLetterAdminRequest} from '../../core/application/dtos/letters/request/get-all-letter-admin-request';
import {GetAllLetterSentRequest} from '../../core/application/dtos/letters/request/get-all-letter-sent-request';
import {GetAllLetterReceivedRequest} from '../../core/application/dtos/letters/request/get-all-letter-received-request';
import {CreateLetterUseCase} from '../../core/application/use-cases/letters/create-letter.usecase';
import {GetAllLetterAdminUseCase} from '../../core/application/use-cases/letters/get-all-letter-admin.usecase';
import {GetAllLetterSentUseCase} from '../../core/application/use-cases/letters/get-all-letter-sent.usecase';
import {GetAllLetterReceivedUseCase} from '../../core/application/use-cases/letters/get-all-letter-received.usecase';
import {DeleteLetterUseCase} from '../../core/application/use-cases/letters/delete-letter.usecase';
import {JwtAuthGuard} from "../../infra/auth/jwt-auth.guard";
import {RolesGuard} from "../../infra/auth/roles.guard";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {GetLetterByUserIdUseCase} from "../../core/application/use-cases/letters/get-letter-by-userId.usecase";
import {Roles} from "../../infra/auth/roles.decorator";
import {SendRandomLetterUseCase} from "../../core/application/use-cases/letters/send-radom-letter.usecase";
import {ReplyLetterUseCase} from "../../core/application/use-cases/letters/reply-letter.usecase";
import {SendRandomLetterRequest} from "../../core/application/dtos/letters/request/send-letter-random-request";
import {ReplyLetterRequest} from "../../core/application/dtos/letters/request/reply-letter.-request";
import {GetUnreadCountUseCase} from "../../core/application/use-cases/letters/get-unread-count.usecase";
import {MarkAsReadUseCase} from "../../core/application/use-cases/letters/mark-as-read.usecase";
import {CheckReplyUseCase} from "../../core/application/use-cases/letters/check-reply.usecase";

@ApiBearerAuth('jwt')
@ApiTags('Letters')
@Controller('letters')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LettersController {
    constructor(
        private readonly createLetterUseCase: CreateLetterUseCase,
        private readonly sendRandomLetterUseCase: SendRandomLetterUseCase,
        private readonly replyLetterUseCase: ReplyLetterUseCase,
        private readonly getAllLetterAdminUseCase: GetAllLetterAdminUseCase,
        private readonly getAllLetterSentUseCase: GetAllLetterSentUseCase,
        private readonly getAllLetterReceivedUseCase: GetAllLetterReceivedUseCase,
        private readonly getLetterByUserIdUseCase: GetLetterByUserIdUseCase,
        private readonly deleteLetterUseCase: DeleteLetterUseCase,
        private readonly getUnreadCountUseCase: GetUnreadCountUseCase,
        private readonly markAsReadUseCase: MarkAsReadUseCase,
        private readonly checkReplyUseCase: CheckReplyUseCase,
    ) {
    }

    @Post()
    createLetter(@Body() body: CreateLetterRequest) {
        return this.createLetterUseCase.execute(body);
    }

    @Post('random')
    sendRandomLetter(@Body() body: SendRandomLetterRequest, @Request() req: any) {
        return this.sendRandomLetterUseCase.execute(req.user.userId, body);
    }

    @Post('reply')
    replyLetter(@Body() body: ReplyLetterRequest, @Request() req: any) {
        return this.replyLetterUseCase.execute(req.user.userId, body);
    }

    @Get('unread-count')
    @UseGuards(JwtAuthGuard)
    async getUnreadCount(@Request() req: any) {
        const userId = req.user.userId;
        const count = await this.getUnreadCountUseCase.execute(userId);
        return {count};
    }

    @Get('admin')
    @Roles('admin')
    getAllLetterAdmin(@Query() query: GetAllLetterAdminRequest) {
        return this.getAllLetterAdminUseCase.execute(query);
    }

    @Get('sent')
    getAllLetterSent(
        @Query() query: GetAllLetterSentRequest,
        @Request() req: any,
    ) {
        const userId = req.user.userId;
        return this.getAllLetterSentUseCase.execute(userId, query);
    }

    @Get('received')
    getAllLetterReceived(
        @Query() query: GetAllLetterReceivedRequest,
        @Request() req: any,
    ) {
        return this.getAllLetterReceivedUseCase.execute(req.user.userId, query);
    }

    @Get(':userId')
    getLetterById(@Param('userId') userId: string) {
        return this.getLetterByUserIdUseCase.execute(userId);
    }
    @Get('check-replied/:letterId')
    async checkReplied(
        @Param('letterId') letterId: string,
    ) {
        return this.checkReplyUseCase.execute(letterId);
    }
    @Patch(':letterId/mark-as-read')
    @UseGuards(JwtAuthGuard)
    async markAsRead(@Param('letterId') letterId: string, @Request() req: any) {
        await this.markAsReadUseCase.execute(letterId, req.user.userId);
        return {success: true};
    }

    @Delete(':id')
    deleteLetter(@Param('id') id: string) {
        return this.deleteLetterUseCase.execute(id);
    }
}
