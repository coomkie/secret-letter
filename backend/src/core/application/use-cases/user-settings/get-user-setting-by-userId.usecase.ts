import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as userSettingsRepository from '../../interfaces/repositories/setting.repository';
import { UserSettingsResponse } from '../../dtos/userSettings/response/userSetting-response';

@Injectable()
export class GetUserSettingByUserIdUseCase {
  constructor(
    @Inject('IUserSettingsRepository')
    private readonly _userSettingsRepository: userSettingsRepository.IUserSettingsRepository,
  ) {}

  async execute(userId: string) {
    const setting =
      await this._userSettingsRepository.getSettingByUserId(userId);
    if (!setting)
      throw new NotFoundException(`User with id ${userId} not found`);
    return new UserSettingsResponse(setting);
  }
}
