import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString } from 'class-validator';

export class GetMessagesRequest {
    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @IsNumberString()
    page?: number;

    @ApiPropertyOptional({ default: 20 })
    @IsOptional()
    @IsNumberString()
    pageSize?: number;
}
