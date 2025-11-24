import {IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {CreateUserSettingRequest} from "../../userSettings/request/create-userSetting-request";
export class CreateUserRequest {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @MaxLength(150)
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsBoolean()
    gender: boolean

    @ApiProperty()
    @IsOptional()
    avatar?: string;

    @ApiProperty()
    @IsNotEmpty()
    @MaxLength(16)
    password: string;

    @ApiProperty()
    @IsOptional()
    setting?: CreateUserSettingRequest;
}
