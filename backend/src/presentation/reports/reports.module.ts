import {Module} from '@nestjs/common';
import {ReportsController} from './reports.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Reports} from "../../core/domain/entities/report.entity";
import {Users} from "../../core/domain/entities/user.entity";
import {Letters} from "../../core/domain/entities/letter.entity";
import {CreateReportUseCase} from "../../core/application/use-cases/reports/create-report.usecase";
import {UpdateReportUseCase} from "../../core/application/use-cases/reports/update-report.usecase";
import {GetReportByIdUseCase} from "../../core/application/use-cases/reports/get-report-by-id.usecase";
import {GetAllReportsUseCase} from "../../core/application/use-cases/reports/get-all-report.usecase";
import {DeleteReportUseCase} from "../../core/application/use-cases/reports/delete-report.usecase";
import {ReportsResponse} from "../../core/application/dtos/reports/response/report-response";
import {ReportRepositoryImpl} from "../../infra/database/repositories/report.repository.impl";

@Module({
    imports: [
        TypeOrmModule.forFeature([Reports, Users, Letters]),
    ],
    controllers: [ReportsController],
    providers: [
        CreateReportUseCase,
        UpdateReportUseCase,
        GetReportByIdUseCase,
        GetAllReportsUseCase,
        DeleteReportUseCase,
        {
            provide: 'IReportsRepository',
            useClass: ReportRepositoryImpl,
        }
    ],
    exports: [
        CreateReportUseCase,
        UpdateReportUseCase,
        GetReportByIdUseCase,
        GetAllReportsUseCase,
        DeleteReportUseCase,
        'IReportsRepository',
    ]
})
export class ReportsModule {
}
