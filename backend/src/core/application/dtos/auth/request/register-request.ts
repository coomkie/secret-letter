import {IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class RegisterRequest {
    @ApiProperty({
        description: 'User email',
        example: 'lekhaiduong@gmail.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsBoolean()
    gender: boolean;

    @ApiProperty()
    @IsString()
    @IsOptional()
    avatar: string;

    @ApiProperty({
        description: 'User password',
        example: '123456',
    })
    @IsNotEmpty()
    @MinLength(3)
    password: string;
}