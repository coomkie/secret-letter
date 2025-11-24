import {UserSettings} from "../../../../domain/entities/user-setting.entity";

export class UserSettingsResponse {
    id: string;
    userId: string;
    allowRandomMessages: boolean;
    preferredMoods: string[];
    notificationsEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(entity: UserSettings) {
        this.id = entity.id;
        this.userId = entity.user.id;
        this.allowRandomMessages = entity.allowRandomMessages;
        this.preferredMoods = entity.preferredMoods;
        this.notificationsEnabled = entity.notificationsEnabled;
        this.createdAt = entity.created_at;
        this.updatedAt = entity.updated_at;
    }
}