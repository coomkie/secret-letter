import {UpdateUserSettingRequest} from "../../dtos/userSettings/request/update-userSetting-request";
import {UserSettings} from "../../../domain/entities/user-setting.entity";

export interface IUserSettingsRepository {
    getSettingByUserId(userId: string): Promise<UserSettings | null>;

    updateSetting(userId: string, data: Partial<UpdateUserSettingRequest>): Promise<UserSettings | null>;

    saveUserSetting(data: UserSettings): Promise<UserSettings>;
}