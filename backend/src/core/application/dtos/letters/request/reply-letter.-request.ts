import {ApiProperty} from "@nestjs/swagger";
import {IsString, IsUUID} from "class-validator";

export class ReplyLetterRequest {
    @ApiProperty()
    @IsUUID()
    matchId: string;

    @ApiProperty()
    @IsString()
    content: string;
}
