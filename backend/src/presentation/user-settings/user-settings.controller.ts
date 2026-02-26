import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUserSettingByUserIdUseCase } from '../../core/application/use-cases/user-settings/get-user-setting-by-userId.usecase';
import { UpdateUserSettingUseCase } from '../../core/application/use-cases/user-settings/update-user-setting.usecase';
import { JwtAuthGuard } from '../../infra/auth/jwt-auth.guard';
import { UpdateUserSettingRequest } from '../../core/application/dtos/userSettings/request/update-userSetting-request';

@ApiBearerAuth('jwt')
@ApiTags('User Settings')
@Controller('user-settings')
export class UserSettingsController {
  constructor(
    private readonly getUserSettingByUserIdUseCase: GetUserSettingByUserIdUseCase,
    private readonly updateUserSettingUseCase: UpdateUserSettingUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  GetUserSettingByUserIdUseCase(@Request() req: any) {
    return this.getUserSettingByUserIdUseCase.execute(req.user.userId);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  UpdateUserSetting(
    @Request() req: any,
    @Body() body: UpdateUserSettingRequest,
  ) {
    return this.updateUserSettingUseCase.execute(req.user.userId, body);
  }
}
