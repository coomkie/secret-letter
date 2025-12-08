import {CreateReportRequest} from "../../dtos/reports/request/create-report-request";
import {GetAllReportRequest} from "../../dtos/reports/request/get-all-report-request";
import {Reports} from "../../../domain/entities/report.entity";

export interface IReportsRepository {
    createReport(data: CreateReportRequest, userId: string): Promise<Reports>

    getAllReports(req: GetAllReportRequest): Promise<{
        items: Reports[];
        total: number;
        page: number;
        pageSize: number;
    }>;

    updateReportStatus(reportId: string): Promise<boolean>;

    deleteReport(reportId: string): Promise<boolean>;

    getReportById(reportId: string): Promise<Reports>;
}