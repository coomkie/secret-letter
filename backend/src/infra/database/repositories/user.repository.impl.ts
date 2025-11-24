import { FindAllUsersOptions, IUsersRepository } from "../../../core/application/interfaces/repositories/user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../../../core/domain/entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserRequest } from "../../../core/application/dtos/users/request/create-user-request";
import { UserSettings } from "../../../core/domain/entities/user-setting.entity";
import { Mood } from "../../../core/domain/enums/mood.enum";
import { Injectable } from "@nestjs/common";
import {Letters} from "../../../core/domain/entities/letter.entity";

@Injectable()
export class UsersRepositoryImpl implements IUsersRepository {
    constructor(
        @InjectRepository(Users)
        private readonly _userRepository: Repository<Users>,

        @InjectRepository(UserSettings)
        private readonly _settingsRepository: Repository<UserSettings>,
    ) {}

    async createUser(data: CreateUserRequest): Promise<Users> {
        const entity = this._userRepository.create(data);
        entity.isAdmin = false;

        if (!entity.avatar) {
            entity.avatar = entity.gender
                ? 'https://res.cloudinary.com/dshe78dng/image/upload/v1763969410/user_male_default_avatar_p3al5t.jpg'
                : 'https://res.cloudinary.com/dshe78dng/image/upload/v1763969409/user_female_default_avatar_xa7tmw.jpg';
        }

        const savedUser = await this._userRepository.save(entity);

        if (data.setting) {
            const setting = this._settingsRepository.create({
                user: savedUser,
                allowRandomMessages: data.setting.allowRandomMessages ?? true,
                preferredMoods: data.setting.preferredMood ?? [Mood.NEUTRAL],
                notificationsEnabled: data.setting.notificationEnabled ?? true,
            });

            await this._settingsRepository.save(setting);
        }

        return savedUser;
    }

    deleteUser(id: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    getAllUsers(options: FindAllUsersOptions): Promise<[Users[], number]> {
        return Promise.resolve([[], 0]);
    }

    getUserByEmail(email: string): Promise<Users | null> {
        return this._userRepository.findOne({
            where: { email },
        });
    }

    getUserById(id: string): Promise<Users | null> {
        return Promise.resolve(new Users());
    }

    saveUser(data: Users): Promise<Users> {
        return Promise.resolve(new Users());
    }
}
