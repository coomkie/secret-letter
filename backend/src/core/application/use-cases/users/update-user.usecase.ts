import {Inject, Injectable, NotFoundException} from "@nestjs/common";
import * as usersRepository from "../../interfaces/repositories/user.repository";
import {UpdateUserRequest} from "../../dtos/users/request/update-user-request";

@Injectable()
export class UpdateUserUseCase {
    constructor(
        @Inject('IUsersRepository')
        private readonly _usersRepository: usersRepository.IUsersRepository
    ) {
    }

    async execute(id: string, model: Partial<UpdateUserRequest>) {
        const user = await this._usersRepository.getUserById(id);
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        if (model.username) user.username = model.username;
        user.avatar = model.gender ? 'https://res.cloudinary.com/dshe78dng/image/upload/v1764082592/user_male_default_avatar-removebg-preview_dhix5q.png'
            : 'https://res.cloudinary.com/dshe78dng/image/upload/v1764082592/user_female_default_avatar-removebg-preview_avvhz2.png';
        user.gender = !!model.gender;
        user.updated_at = new Date();
        return this._usersRepository.saveUser(user);
    }
}