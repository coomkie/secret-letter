import {Inject, Injectable, NotFoundException} from "@nestjs/common";
import * as userSettingsRepository from "../../interfaces/repositories/setting.repository";
import {UpdateUserSettingRequest} from "../../dtos/userSettings/request/update-userSetting-request";
import {Mood} from "../../../domain/enums/mood.enum";

@Injectable()
export class UpdateUserSettingUseCase {
    constructor(
        @Inject('IUserSettingsRepository')
        private readonly _userSettingsRepository: userSettingsRepository.IUserSettingsRepository) {
    }

    async execute(userId: string, model: Partial<UpdateUserSettingRequest>) {
        const setting = await this._userSettingsRepository.getSettingByUserId(userId);
        if (!setting) throw new NotFoundException(`User with id ${userId} not found`);
        setting.allowRandomMessages = model.allowRandomMessages ?? true;
        setting.notificationsEnabled = model.notificationEnabled ?? true;
        setting.preferredMoods = model.preferredMood ?? new String[Mood.NEUTRAL];
        setting.updated_at = new Date();
        return this._userSettingsRepository.saveUserSetting(setting);
    }
}