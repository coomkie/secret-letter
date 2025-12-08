import {ApiProperty} from "@nestjs/swagger";
import {IsString, IsUUID} from "class-validator";

export class CreateReportRequest {

    @ApiProperty()
    @IsUUID()
    letterId: string;

    @ApiProperty()
    @IsString()
    reason: string;
}