import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ForgotPasswordRequest {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  email: string;
}