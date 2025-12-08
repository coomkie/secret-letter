import {Inject, Injectable, NotFoundException} from "@nestjs/common";
import * as reportRepository from "../../interfaces/repositories/report.repository";
import {ReportsResponse} from "../../dtos/reports/response/report-response";

@Injectable()
export class GetReportByIdUseCase {
    constructor(
        @Inject('IReportsRepository')
        private readonly reportsRepository: reportRepository.IReportsRepository
    ) {
    }

    async execute(id: string): Promise<ReportsResponse> {
        const report = await this.reportsRepository.getReportById(id);
        if (!report) {
            throw new NotFoundException(`Report with id ${id} not found`);
        }
        return new ReportsResponse(report);
    }
}