import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../infra/auth/roles.guard';
import { JwtAuthGuard } from '../../infra/auth/jwt-auth.guard';
import { CreateReportUseCase } from '../../core/application/use-cases/reports/create-report.usecase';
import { UpdateReportUseCase } from '../../core/application/use-cases/reports/update-report.usecase';
import { DeleteReportUseCase } from '../../core/application/use-cases/reports/delete-report.usecase';
import { GetReportByIdUseCase } from '../../core/application/use-cases/reports/get-report-by-id.usecase';
import { GetAllReportsUseCase } from '../../core/application/use-cases/reports/get-all-report.usecase';
import { CreateReportRequest } from '../../core/application/dtos/reports/request/create-report-request';
import { GetAllReportRequest } from '../../core/application/dtos/reports/request/get-all-report-request';
import { Roles } from '../../infra/auth/roles.decorator';

@ApiBearerAuth('jwt')
@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(
    private readonly createReportUseCase: CreateReportUseCase,
    private readonly updateReportUseCase: UpdateReportUseCase,
    private readonly deleteReportUseCase: DeleteReportUseCase,
    private readonly getReportByIdUseCase: GetReportByIdUseCase,
    private readonly getAllReportUseCase: GetAllReportsUseCase,
  ) {}

  @Post()
  createReport(@Body() body: CreateReportRequest, @Req() req: any) {
    return this.createReportUseCase.execute(body, req.user.userId);
  }

  @Get()
  @Roles('admin')
  getAllReport(@Query() query: GetAllReportRequest) {
    return this.getAllReportUseCase.execute(query);
  }

  @Get(':id')
  @Roles('admin')
  getReportById(@Param('id') id: string) {
    return this.getReportByIdUseCase.execute(id);
  }

  @Patch(':id')
  @Roles('admin')
  updateReport(@Param('id') id: string) {
    return this.updateReportUseCase.execute(id);
  }

  @Delete(':id')
  @Roles('admin')
  deleteReport(@Param('id') id: string) {
    return this.deleteReportUseCase.execute(id);
  }
}
