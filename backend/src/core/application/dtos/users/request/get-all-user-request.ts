import {ApiPropertyOptional} from "@nestjs/swagger";
import {IsNumberString, IsOptional} from "class-validator";

export class GetAllUserRequest {
    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @IsNumberString()
    page?: number;

    @ApiPropertyOptional({ default: 10 })
    @IsOptional()
    @IsNumberString()
    pageSize?: number;

    @ApiPropertyOptional()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({ default: 'created_at' })
    @IsOptional()
    sortBy?: string;

    @ApiPropertyOptional({ default: 'DESC', enum: ['ASC', 'DESC'] })
    @IsOptional()
    sortOrder?: 'ASC' | 'DESC';
}
