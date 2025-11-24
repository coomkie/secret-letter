import {IsEmail, IsNotEmpty, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class LoginRequest {
    @ApiProperty({
        description: 'User email',
        example: 'lekhaiduong@gmail.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'User password',
        example: '123456',
    })
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}