import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../core/application/use-cases/users/create-user.usecase';
import { JwtAuthGuard } from '../../infra/auth/jwt-auth.guard';
import { RolesGuard } from '../../infra/auth/roles.guard';
import { Roles } from '../../infra/auth/roles.decorator';
import { CreateUserRequest } from '../../core/application/dtos/users/request/create-user-request';
import { UpdateUserUseCase } from '../../core/application/use-cases/users/update-user.usecase';
import { GetAllUsersUseCase } from '../../core/application/use-cases/users/get-all-user.usecase';
import { DeleteUserUseCase } from '../../core/application/use-cases/users/delete-user.usecase';
import { GetUserByIdUseCase } from '../../core/application/use-cases/users/get-user-by-id.usecase';
import { GetAllUserRequest } from '../../core/application/dtos/users/request/get-all-user-request';
import { UpdateUserRequest } from '../../core/application/dtos/users/request/update-user-request';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth('jwt')
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAllUser(@Query() query: GetAllUserRequest) {
    const {
      page = 1,
      pageSize = 10,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = query;
    return this.getAllUsersUseCase.execute({
      page: Number(page),
      pageSize: Number(pageSize),
      search,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  GetUserById(@Param('id') id: string) {
    return this.getUserByIdUseCase.execute(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createUser(@Body() body: CreateUserRequest) {
    return this.createUserUseCase.execute(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update user profile and avatar',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', nullable: true },
        gender: { type: 'boolean', nullable: true },
        avatar: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
      },
    },
  })
  UpdateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.updateUserUseCase.execute(id, body, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  DeleteUser(@Param('id') id: string) {
    return this.deleteUserUseCase.execute(id);
  }
}
