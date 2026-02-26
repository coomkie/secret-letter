import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString, IsIn } from 'class-validator';

export class PaginationRequest {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumberString()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsNumberString()
  pageSize?: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ default: 'created_at' })
  @IsOptional()
  sortBy?: string | 'created_at';

  @ApiPropertyOptional({ default: 'DESC', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
