import {Inject, Injectable} from "@nestjs/common";
import * as reportRepository from "../../interfaces/repositories/report.repository";
import {GetAllReportRequest} from "../../dtos/reports/request/get-all-report-request";
import {ReportsResponse} from "../../dtos/reports/response/report-response";

@Injectable()
export class GetAllReportsUseCase {
    constructor(
        @Inject('IReportsRepository')
        private readonly reportsRepository: reportRepository.IReportsRepository
    ) {
    }

    async execute(req: GetAllReportRequest): Promise<{
        items: ReportsResponse[];
        total: number;
        page: number;
        pageSize: number;
    }> {
        const {items, total, page, pageSize} = await this.reportsRepository.getAllReports(req);

        return {
            items: items.map(item => new ReportsResponse(item)),
            total,
            page,
            pageSize
        }
    }
}