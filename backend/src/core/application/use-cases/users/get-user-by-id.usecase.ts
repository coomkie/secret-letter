import {Inject, Injectable, NotFoundException} from "@nestjs/common";
import * as userRepository from "../../interfaces/repositories/user.repository";
import {UserResponse} from "../../dtos/users/response/user-response";

@Injectable()
export class GetUserByIdUseCase {
    constructor(
        @Inject('IUsersRepository')
        private readonly _usersRepository: userRepository.IUsersRepository) {
    }
    async execute(id: string) {
        const user = await this._usersRepository.getUserById(id);
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        return new UserResponse(user);
    }
}
