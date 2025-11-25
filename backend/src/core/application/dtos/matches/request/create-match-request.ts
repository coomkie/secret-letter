import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsUUID} from "class-validator";

export class CreateMatchRequest {
    @ApiProperty({ description: 'Sender user ID', example: 'uuid-of-sender' })
    @IsUUID()
    @IsNotEmpty()
    senderId: string;

    @ApiProperty({ description: 'Receiver user ID', example: 'uuid-of-receiver' })
    @IsUUID()
    @IsNotEmpty()
    receiverId: string;
}