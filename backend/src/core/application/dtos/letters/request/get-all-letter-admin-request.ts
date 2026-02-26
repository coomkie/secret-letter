import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID, IsBooleanString } from 'class-validator';
import { Mood } from '../../../../domain/enums/mood.enum';
import { PaginationRequest } from './pagination-request';

export class GetAllLetterAdminRequest extends PaginationRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  matchId?: string;

  @ApiPropertyOptional({ enum: Mood })
  @IsOptional()
  @IsEnum(Mood)
  mood?: Mood;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBooleanString()
  isRead?: string;
}
