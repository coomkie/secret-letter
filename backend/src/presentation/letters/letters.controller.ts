import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Query,
    Body,
    UseGuards,
    Request,
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

@ApiBearerAuth('jwt')
@ApiTags('Letters')
@Controller('letters')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LettersController {
    constructor(
        private readonly createLetterUseCase: CreateLetterUseCase,
        private readonly getAllLetterAdminUseCase: GetAllLetterAdminUseCase,
        private readonly getAllLetterSentUseCase: GetAllLetterSentUseCase,
        private readonly getAllLetterReceivedUseCase: GetAllLetterReceivedUseCase,
        private readonly getLetterByUserIdUseCase: GetLetterByUserIdUseCase,
        private readonly deleteLetterUseCase: DeleteLetterUseCase,
    ) {
    }

    @Post()
    createLetter(@Body() body: CreateLetterRequest) {
        return this.createLetterUseCase.execute(body);
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

    @Delete(':id')
    deleteLetter(@Param('id') id: string) {
        return this.deleteLetterUseCase.execute(id);
    }
}
