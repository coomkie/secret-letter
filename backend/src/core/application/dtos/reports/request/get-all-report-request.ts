import {ApiPropertyOptional} from "@nestjs/swagger";
import {IsEnum, IsNumberString, IsOptional, IsUUID} from "class-validator";
import {MatchStatus} from "../../../../domain/enums/match-status.enum";
import {ReportStatus} from "../../../../domain/enums/report-status.enum";

export class GetAllReportRequest {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    userId?: string;

    @ApiPropertyOptional({enum: ReportStatus})
    @IsOptional()
    @IsEnum(ReportStatus)
    status?: ReportStatus;

    @ApiPropertyOptional({default: 1})
    @IsOptional()
    @IsNumberString()
    page?: number;

    @ApiPropertyOptional({default: 10})
    @IsOptional()
    @IsNumberString()
    pageSize?: number;

    @ApiPropertyOptional({default: 'created_at'})
    @IsOptional()
    sortBy?: string;

    @ApiPropertyOptional({default: 'DESC', enum: ['ASC', 'DESC']})
    @IsOptional()
    sortOrder?: 'ASC' | 'DESC';
}