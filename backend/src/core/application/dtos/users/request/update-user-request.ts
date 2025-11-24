import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsOptional, IsString, MaxLength} from "class-validator";

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
    @IsBoolean()
    gender: boolean;

    @ApiProperty()
    @IsOptional()
    avatar: string;

}