import {Mood} from "../../../../domain/enums/mood.enum";
import {ApiProperty} from "@nestjs/swagger";
import {IsEnum, IsString} from "class-validator";

export class SendRandomLetterRequest {
    @ApiProperty()
    @IsString()
    content: string;

    @ApiProperty()
    @IsEnum(Mood)
    mood: Mood;
}
