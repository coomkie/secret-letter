import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsEnum, IsNumberString } from 'class-validator';
import { MatchStatus } from '../../../../domain/enums/match-status.enum';

export class GetAllMatchAdminRequest {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    senderId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    receiverId?: string;

    @ApiPropertyOptional({ enum: MatchStatus })
    @IsOptional()
    @IsEnum(MatchStatus)
    status?: MatchStatus;

    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @IsNumberString()
    page?: number;

    @ApiPropertyOptional({ default: 10 })
    @IsOptional()
    @IsNumberString()
    pageSize?: number;

    @ApiPropertyOptional({ default: 'created_at' })
    @IsOptional()
    sortBy?: string;

    @ApiPropertyOptional({ default: 'DESC', enum: ['ASC', 'DESC'] })
    @IsOptional()
    sortOrder?: 'ASC' | 'DESC';
}
