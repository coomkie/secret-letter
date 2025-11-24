import {PaginationRequest} from "./pagination-request";
import {Mood} from "../../../../domain/enums/mood.enum";
import {ApiPropertyOptional} from "@nestjs/swagger";
import {IsEnum, IsOptional} from "class-validator";

export class GetAllLetterSentRequest extends PaginationRequest {
    @ApiPropertyOptional({enum: Mood})
    @IsOptional()
    @IsEnum(Mood)
    mood?: Mood;
}
