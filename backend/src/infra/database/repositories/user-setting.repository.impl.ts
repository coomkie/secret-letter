import {Injectable, NotFoundException} from "@nestjs/common";
import {IUserSettingsRepository} from "../../../core/application/interfaces/repositories/setting.repository";
import {UpdateUserSettingRequest} from "src/core/application/dtos/userSettings/request/update-userSetting-request";
import {UserSettings} from "src/core/domain/entities/user-setting.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Mood} from "../../../core/domain/enums/mood.enum";

@Injectable()
export class UsersSettingsRepositoryImpl implements IUserSettingsRepository {
    constructor(
        @InjectRepository(UserSettings)
        private readonly _userSettingsRepository: Repository<UserSettings>,
    ) {
    }

    getSettingByUserId(userId: string): Promise<UserSettings | null> {
        return this._userSettingsRepository.findOne({
            where: {user: {id: userId}}, relations: ['user']
        })
    }

    async updateSetting(userId: string, data: Partial<UpdateUserSettingRequest>): Promise<UserSettings | null> {
        const setting = await this._userSettingsRepository.findOneBy({
            user: {id: userId}
        });
        if (!setting) throw new NotFoundException(`User with id ${userId} not found`);
        setting.allowRandomMessages = data.allowRandomMessages ?? true;
        setting.notificationsEnabled = data.notificationEnabled ?? true;
        setting.preferredMoods = data.preferredMood ?? new String[Mood.NEUTRAL];

        const result = await this._userSettingsRepository.save(setting);
        if (result) {
            result.updated_at = new Date();
            await this._userSettingsRepository.save(result);
        }
        return result;
    }

    saveUserSetting(data: UserSettings): Promise<UserSettings> {
        return this._userSettingsRepository.save(data);
    }
}