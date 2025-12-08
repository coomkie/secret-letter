import {Inject, Injectable, NotFoundException} from "@nestjs/common";
import * as reportRepository from "../../interfaces/repositories/report.repository";

@Injectable()
export class DeleteReportUseCase {
    constructor(
        @Inject('IReportsRepository')
        private readonly reportsRepository: reportRepository.IReportsRepository
    ) {
    }

    async execute(reportId: string): Promise<void> {
        const letter = await this.reportsRepository.getReportById(reportId);

        if (!letter) {
            throw new NotFoundException(`Report with id ${reportId} not found`);
        }

        await this.reportsRepository.deleteReport(reportId);
    }
}