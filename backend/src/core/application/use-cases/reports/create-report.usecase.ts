import {Inject, Injectable, NotFoundException} from "@nestjs/common";
import * as reportRepository from "../../interfaces/repositories/report.repository";
import {ReportsResponse} from "../../dtos/reports/response/report-response";
import {CreateReportRequest} from "../../dtos/reports/request/create-report-request";

@Injectable()
export class CreateReportUseCase {
    constructor(
        @Inject('IReportsRepository')
        private readonly reportsRepository: reportRepository.IReportsRepository
    ) {
    }

    async execute(data: CreateReportRequest, userId: string): Promise<ReportsResponse> {
        const report = await this.reportsRepository.createReport(data, userId);

        if (!report) {
            throw new NotFoundException('Failed to create report');
        }

        return new ReportsResponse(report);
    }
}