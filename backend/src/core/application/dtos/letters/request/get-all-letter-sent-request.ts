import {PaginationRequest} from "./pagination-request";
import {Mood} from "../../../../domain/enums/mood.enum";
import {ApiPropertyOptional} from "@nestjs/swagger";
import {IsDateString, IsEnum, IsOptional} from "class-validator";

export class GetAllLetterSentRequest extends PaginationRequest {
    @ApiPropertyOptional({enum: Mood})
    @IsOptional()
    @IsEnum(Mood)
    mood?: Mood;

    @ApiPropertyOptional({description: 'Start date for filtering (YYYY-MM-DD)'})
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({description: 'End date for filtering (YYYY-MM-DD)'})
    @IsOptional()
    @IsDateString()
    endDate?: string;
}
