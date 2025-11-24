import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Mood } from '../../../../domain/enums/mood.enum';

export class CreateLetterRequest {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsEnum(Mood)
    mood: Mood;

    @IsUUID()
    userId: string;

    @IsOptional()
    @IsUUID()
    matchId?: string;
}
