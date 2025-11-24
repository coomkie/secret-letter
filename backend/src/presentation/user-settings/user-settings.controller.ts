import {Body, Controller, Get, Param, Patch, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {
    GetUserSettingByUserIdUseCase
} from "../../core/application/use-cases/user-settings/get-user-setting-by-userId.usecase";
import {UpdateUserSettingUseCase} from "../../core/application/use-cases/user-settings/update-user-setting.usecase";
import {JwtAuthGuard} from "../../infra/auth/jwt-auth.guard";
import {UpdateUserSettingRequest} from "../../core/application/dtos/userSettings/request/update-userSetting-request";

@ApiBearerAuth('jwt')
@ApiTags('User Settings')
@Controller('user-settings')
export class UserSettingsController {
    constructor(
        private readonly getUserSettingByUserIdUseCase: GetUserSettingByUserIdUseCase,
        private readonly updateUserSettingUseCase: UpdateUserSettingUseCase,
    ) {
    }

    @Get(':userId')
    @UseGuards(JwtAuthGuard)
    GetUserSettingByUserIdUseCase(@Param('userId') userId: string) {
        return this.getUserSettingByUserIdUseCase.execute(userId);
    }

    @Patch(':userId')
    @UseGuards(JwtAuthGuard)
    UpdateUserSetting(@Param('userId') userId: string, @Body() body: UpdateUserSettingRequest) {
        return this.updateUserSettingUseCase.execute(userId, body);
    }

}
