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
        user.updated_at = new Date();
        return this._usersRepository.saveUser(user);
    }
}