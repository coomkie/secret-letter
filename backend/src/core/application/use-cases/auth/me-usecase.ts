import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as userRepository from '../../interfaces/repositories/user.repository';
import * as letterRepository from '../../interfaces/repositories/letter.repository';
import * as matchRepository from '../../interfaces/repositories/match.repository';

@Injectable()
export class MeUseCase {
  constructor(
    @Inject('IUsersRepository')
    private readonly _userRepository: userRepository.IUsersRepository,
    @Inject('ILettersRepository')
    private readonly lettersRepo: letterRepository.ILettersRepository,
    @Inject('IMatchesRepository')
    private readonly matchesRepo: matchRepository.IMatchesRepository,
  ) {}

  async execute(userId: string) {
    const user = await this._userRepository.getUserById(userId);

    if (!user) throw new NotFoundException('User not found');

    // Total letters sent by this user
    const lettersCount = await this.lettersRepo.count({
      where: { user: { id: user.id }, isRead: true },
    });

    const sentMatchesCount = await this.lettersRepo.countDistinctConnections(
      user.id,
    );

    const receivedMatchesCount = await this.lettersRepo.countReceivedLetters(
      user.id,
    );

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      gender: user.gender,
      letters: lettersCount,
      sentMatches: sentMatchesCount,
      receivedMatches: receivedMatchesCount,

      created_at: user.created_at,
    };
  }
}
