import { MatchStatus } from '../../../../domain/enums/match-status.enum';
import { Matches } from '../../../../domain/entities/match.entity';

export class MatchNoMessagesResponse {
  id: string;
  senderId: string;
  receiverId: string;
  status: MatchStatus;
  letterIds: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: Matches) {
    this.id = entity.id;
    this.senderId = entity.sender.id;
    this.receiverId = entity.receiver.id;
    this.status = entity.status;

    this.letterIds = Array.isArray(entity.letters)
      ? entity.letters.map((l) => l.id)
      : [];

    this.createdAt = entity.created_at;
    this.updatedAt = entity.updated_at;
  }
}
