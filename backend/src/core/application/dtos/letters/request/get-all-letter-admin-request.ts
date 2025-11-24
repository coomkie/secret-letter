import {IsEnum, IsOptional, IsUUID} from 'class-validator';
import {PaginationRequest} from "./pagination-request";
import {ApiPropertyOptional} from "@nestjs/swagger";
import {Mood} from "../../../../domain/enums/mood.enum";

export class GetAllLetterAdminRequest extends PaginationRequest {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    userId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    matchId?: string;

    @ApiPropertyOptional({enum: Mood})
    @IsOptional()
    @IsEnum(Mood)
    mood?: Mood;

    @ApiPropertyOptional()
    @IsOptional()
    @IsOptional()
    isSent?: boolean;
}
