import {ReportStatus} from "../../../../domain/enums/report-status.enum";
import {Reports} from "../../../../domain/entities/report.entity";

export class ReportsResponse {
    id: string;
    userId: string;
    letterId: string;
    reason: string;
    status: ReportStatus;
    createdAt: Date;
    updatedAt: Date;

    constructor(entity: Reports) {
        this.id = entity.id;
        this.userId = entity.reporter.id;
        this.letterId = entity.targetLetter.id;
        this.reason = entity.reason;
        this.status = entity.status;
        this.createdAt = new Date(entity.created_at);
        this.updatedAt = new Date(entity.updated_at);

    }
}