import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class ReplyLetterRequest {
  @ApiProperty()
  @IsUUID()
  matchId: string;

  @ApiProperty()
  @IsUUID()
  letterId: string;

  @ApiProperty()
  @IsString()
  content: string;
}
