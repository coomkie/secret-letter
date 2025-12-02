import { Mood } from "../../../../domain/enums/mood.enum";
import { Letters } from "../../../../domain/entities/letter.entity";

export class LetterShortResponse {
    id: string;
    mood: Mood;
    isRead: boolean;
    userId: string;
    createdAt: Date;

    constructor(entity: Letters) {
        this.id = entity.id;
        this.mood = entity.mood;
        this.isRead = entity.isRead;
        this.userId = entity.user?.id;
        this.createdAt = entity.created_at;
    }
}
