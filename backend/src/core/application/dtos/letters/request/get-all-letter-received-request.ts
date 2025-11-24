import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Mood } from '../../../../domain/enums/mood.enum';
import {PaginationRequest} from "./pagination-request";

export class GetAllLetterReceivedRequest extends PaginationRequest {
    @ApiPropertyOptional({ enum: Mood })
    @IsOptional()
    @IsEnum(Mood)
    mood?: Mood;
}
