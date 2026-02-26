import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateMatchUseCase } from '../../core/application/use-cases/matches/create-match.usecase';
import { GetAllMatchAdminUseCase } from '../../core/application/use-cases/matches/get-all-match-admin.usecase';
import { GetMatchByIdUseCase } from '../../core/application/use-cases/matches/get-match-by-id.usecase';
import { DeleteMatchUseCase } from '../../core/application/use-cases/matches/delete-match.usecase';
import { CreateMatchRequest } from '../../core/application/dtos/matches/request/create-match-request';
import { GetAllMatchAdminRequest } from '../../core/application/dtos/matches/request/get-all-match-admin-request';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetAllMatchUserUseCase } from '../../core/application/use-cases/matches/get-all-match.usecase';
import { JwtAuthGuard } from '../../infra/auth/jwt-auth.guard';
import { GetAllMatchUserRequest } from '../../core/application/dtos/matches/request/get-all-match-request';
import { RolesGuard } from '../../infra/auth/roles.guard';
import { Roles } from '../../infra/auth/roles.decorator';

@ApiBearerAuth('jwt')
@ApiTags('Matches')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('matches')
export class MatchesController {
  constructor(
    private readonly createMatchUseCase: CreateMatchUseCase,
    private readonly getAllMatchAdminUseCase: GetAllMatchAdminUseCase,
    private readonly getAllMatchUserUseCase: GetAllMatchUserUseCase,
    private readonly getMatchByIdUseCase: GetMatchByIdUseCase,
    private readonly deleteMatchUseCase: DeleteMatchUseCase,
  ) {}

  @Post()
  async createMatch(@Body() body: CreateMatchRequest) {
    return this.createMatchUseCase.execute(body);
  }

  @Get('admin')
  @Roles('admin')
  async getAllMatchAdmin(@Query() query: GetAllMatchAdminRequest) {
    return this.getAllMatchAdminUseCase.execute(query);
  }

  @Get('user/:userId')
  async getAllMatch(
    @Param('userId') userId: string,
    @Query() query: GetAllMatchUserRequest,
  ) {
    return this.getAllMatchUserUseCase.execute(userId, query);
  }

  @Get(':id')
  @Roles('admin')
  async getMatchById(@Param('id') id: string) {
    return this.getMatchByIdUseCase.execute(id);
  }

  @Delete(':id')
  async deleteMatch(@Param('id') id: string) {
    return this.deleteMatchUseCase.execute(id);
  }
}
