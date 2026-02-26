import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
export class UpdateUserRequest {
  @ApiProperty({
    description: 'name of user',
    example: 'john doe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  username: string;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  gender?: boolean;

  @ApiProperty()
  @IsOptional()
  avatar: string;
}
