import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../infra/auth/jwt-auth.guard";
import {RolesGuard} from "../../infra/auth/roles.guard";
import {GetCommonStatisticUseCase} from "../../core/application/use-cases/statistics/get-common-statistic.usecase";
import {Roles} from "../../infra/auth/roles.decorator";

@Controller('statistics')
@ApiTags('statistics')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatisticsController {
    constructor(
        private readonly getCommonStatisticUseCase: GetCommonStatisticUseCase,
    ) {
    }

    @Get()
    @Roles('admin')
    getCommonStatistic(@Req() req: any) {
        return this.getCommonStatisticUseCase.execute(req.user.userId);
    }
}
