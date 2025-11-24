import {FindAllUsersOptions, IUsersRepository} from "../../../core/application/interfaces/repositories/user.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {Users} from "../../../core/domain/entities/user.entity";
import {Like, Repository} from "typeorm";
import {CreateUserRequest} from "../../../core/application/dtos/users/request/create-user-request";
import {UserSettings} from "../../../core/domain/entities/user-setting.entity";
import {Mood} from "../../../core/domain/enums/mood.enum";
import {Injectable, NotFoundException} from "@nestjs/common";
import {UpdateUserRequest} from "src/core/application/dtos/users/request/update-user-request";

@Injectable()
export class UsersRepositoryImpl implements IUsersRepository {
    constructor(
        @InjectRepository(Users)
        private readonly _userRepository: Repository<Users>,
        @InjectRepository(UserSettings)
        private readonly _settingsRepository: Repository<UserSettings>,
    ) {
    }

    getUserByReportId(reportId: string): Promise<Users | null> {
        return this._userRepository.findOne({
            where: {reports: {id: reportId}},
            relations: {
                settings: {
                    user: true
                },
                letters: {
                    user: true
                },
                sentMatches: {
                    sender: true
                },
                receivedMatches: {
                    receiver: true
                },
                reports: {
                    reporter: true
                },
            }
        });
    }

    getUserByLetterId(letterId: string): Promise<Users | null> {
        return this._userRepository.findOne({
            where: {letters: {id: letterId}},
            relations: {
                settings: {
                    user: true
                },
                letters: {
                    user: true
                },
                sentMatches: {
                    sender: true
                },
                receivedMatches: {
                    receiver: true
                },
                reports: {
                    reporter: true
                },
            }
        });
    }

    async updateUser(id: string, data: Partial<UpdateUserRequest>): Promise<Users> {
        const user = await this._userRepository.findOneBy({
            id, isAdmin: false
        });
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        if (data.username) user.username = data.username;
        if (data.gender) user.gender = data.gender;
        if (data.avatar) user.avatar = data.avatar;

        const result = await this._userRepository.save(user);
        if (result) {
            result.updated_at = new Date();
            await this._userRepository.save(result);
        }
        return result;
    }

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

    async deleteUser(id: string): Promise<void> {
        await this._userRepository.delete(id);
    }

    async getAllUsers(options: FindAllUsersOptions): Promise<[Users[], number]> {
        const {page = 1, pageSize = 10, search, sortBy = 'created_at', sortOrder = 'DESC'} = options;
        const where: any = {isAdmin: false};

        if (search) where.email = Like(`%${search}%`);

        return await this._userRepository.findAndCount({
            where,
            order: {[sortBy]: sortOrder},
            skip: (page - 1) * pageSize,
            take: pageSize,
        })
    }

    getUserByEmail(email: string): Promise<Users | null> {
        return this._userRepository.findOne({
            where: {email},
            relations: {
                settings: {
                    user: true
                },
                letters: {
                    user: true
                },
                sentMatches: {
                    sender: true
                },
                receivedMatches: {
                    receiver: true
                },
                reports: {
                    reporter: true
                },
            }
        });
    }

    getUserById(id: string): Promise<Users | null> {
        return this._userRepository.findOne({
            where: {id, isAdmin: false},
            relations: {
                settings: {
                    user: true
                },
                letters: {
                    user: true
                },
                sentMatches: {
                    sender: true
                },
                receivedMatches: {
                    receiver: true
                },
                reports: {
                    reporter: true
                },
            }
        });
    }

    saveUser(data: Users): Promise<Users> {
        return this._userRepository.save(data);
    }
}
