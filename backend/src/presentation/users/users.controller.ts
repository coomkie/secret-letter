import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {ApiBearerAuth} from "@nestjs/swagger";
import {CreateUserUseCase} from "../../core/application/use-cases/users/create-user.usecase";
import {JwtAuthGuard} from "../../infra/auth/jwt-auth.guard";
import {RolesGuard} from "../../infra/auth/roles.guard";
import {Roles} from "../../infra/auth/roles.decorator";
import {CreateUserRequest} from "../../core/application/dtos/users/request/create-user-request";

@ApiBearerAuth('jwt')
@Controller('users')
export class UsersController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase
    ) {
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    createUser(@Body() body: CreateUserRequest) {
        return this.createUserUseCase.execute(body);
    }
}
