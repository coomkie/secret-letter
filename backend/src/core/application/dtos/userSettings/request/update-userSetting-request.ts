import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserSettingRequest {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  allowRandomMessages: boolean;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredMood: string[];

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  notificationEnabled: boolean;
}
