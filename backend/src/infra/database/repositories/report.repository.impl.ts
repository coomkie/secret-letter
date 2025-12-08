import {Injectable, NotFoundException} from "@nestjs/common";
import {IReportsRepository} from "../../../core/application/interfaces/repositories/report.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Reports} from "../../../core/domain/entities/report.entity";
import {CreateReportRequest} from "src/core/application/dtos/reports/request/create-report-request";
import {GetAllReportRequest} from "src/core/application/dtos/reports/request/get-all-report-request";
import {ReportStatus} from "../../../core/domain/enums/report-status.enum";
import {Users} from "../../../core/domain/entities/user.entity";
import {Letters} from "../../../core/domain/entities/letter.entity";

@Injectable()
export class ReportRepositoryImpl implements IReportsRepository {
    constructor(
        @InjectRepository(Reports)
        private readonly reportRepo: Repository<Reports>,
        @InjectRepository(Users)
        private readonly userRepo: Repository<Users>,
    ) {
    }

    async createReport(data: CreateReportRequest, userId: string): Promise<Reports> {
        const user = await this.userRepo.findOne({where: {id: userId}});
        if (!user) throw new NotFoundException("User does not exist");
        const entity = this.reportRepo.create({
            reporter: user,
            targetLetter: data.letterId ? {id: data.letterId} as Letters : null,
            status: ReportStatus.PENDING,
            reason: data.reason,
            created_at: new Date(),
            updated_at: new Date(),
        } as Partial<Reports>);
        return this.reportRepo.save(entity);
    }

    async getAllReports(req: GetAllReportRequest): Promise<{
        items: Reports[];
        total: number;
        page: number;
        pageSize: number;
    }> {
        const page = Number(req.page) || 1;
        const pageSize = Number(req.pageSize) || 10;
        const qb = this.reportRepo.createQueryBuilder('reports')
            .leftJoinAndSelect('reports.reporter', 'user')
            .leftJoinAndSelect('reports.targetLetter', 'letter');

        if (req.userId) qb.andWhere('user.id = :userId', { userId: req.userId });
        if (req.status) qb.andWhere('reports.status = :status', { status: req.status });

        const sortColumn = req.sortBy?.includes('.')
            ? req.sortBy
            : `reports.${req.sortBy || 'created_at'}`;

        qb.orderBy(sortColumn, req.sortOrder ?? 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize);

        const [items, total] = await qb.getManyAndCount();

        return { items, total, page, pageSize };

    }

    async updateReportStatus(reportId: string): Promise<boolean> {
        const report = await this.reportRepo.findOne({where: {id: reportId}});
        if (!report) throw new NotFoundException("Report does not exist");
        report.status = report.status == ReportStatus.PENDING
            ? ReportStatus.REVIEWED
            : ReportStatus.PENDING;
        await this.reportRepo.save(report);
        return true;
    }

    async deleteReport(reportId: string): Promise<boolean> {
        const report = await this.reportRepo.findOne({where: {id: reportId}});
        if (!report) throw new NotFoundException("Report does not exist");
        await this.reportRepo.delete(reportId);
        return true;
    }

    async getReportById(reportId: string): Promise<Reports> {
        const report = await this.reportRepo.findOne({where: {id: reportId}});
        if (!report) throw new NotFoundException("Report does not exist");

        return report;
    }

}