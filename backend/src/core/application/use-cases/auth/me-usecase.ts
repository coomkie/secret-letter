import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import * as userRepository from "../../interfaces/repositories/user.repository";

@Injectable()
export class MeUseCase {
    constructor(
        @Inject('IUsersRepository')
        private readonly _userRepository: userRepository.IUsersRepository
    ) {
    }

    async execute(userId: string) {
        const user = await this._userRepository.getUserById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            gender: user.gender,
            letters: user.letters.length,
            sentMatches: user.sentMatches.length,
            receivedMatches: user.receivedMatches.length,
            created_at: user.created_at,
            setting: user.settings,
            isAdmin: user.isAdmin,
        };
    }
}
