import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Mood } from '../../../../domain/enums/mood.enum';
import {ApiProperty} from "@nestjs/swagger";

export class CreateLetterRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty()
    @IsEnum(Mood)
    mood: Mood;

    @ApiProperty()
    @IsUUID()
    userId: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    matchId?: string;
}
