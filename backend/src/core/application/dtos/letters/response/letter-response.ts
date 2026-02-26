import { Mood } from '../../../../domain/enums/mood.enum';
import { Letters } from '../../../../domain/entities/letter.entity';

export class LettersResponse {
  id: string;
  content: string;
  mood: Mood;
  isSent: boolean;
  isRead: boolean;
  isReply: boolean;
  sendAt: Date;
  userId: string;
  matchId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: Letters) {
    this.id = entity.id;
    this.content = entity.content;
    this.mood = entity.mood;
    this.isSent = entity.isSent;
    this.isRead = entity.isRead;
    this.isReply = entity.isReply;
    this.sendAt = entity.sendAt;
    this.userId = entity.user?.id ?? null;
    this.matchId = entity.match.id;
    this.createdAt = entity.created_at;
    this.updatedAt = entity.updated_at;
  }
}
