import {Mood} from "../../../../domain/enums/mood.enum";
import {Letters} from "../../../../domain/entities/letter.entity";

export class LetterSendResponse {
    id: string;
    content: string;
    mood: Mood;
    isSent: boolean;
    isRead: boolean;
    isReply: boolean;
    sendAt: Date;
    otherUser: {
        id: string;
        username: string;
        avatar: string;
    };
    matchId: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(entity: Letters, currentUserId: string) {
        this.id = entity.id;
        this.content = entity.content;
        this.mood = entity.mood;
        this.isSent = entity.isSent;
        this.isRead = entity.isRead;
        this.isReply = entity.isReply;
        this.sendAt = entity.sendAt;
        // Xác định bên còn lại trong match
        this.otherUser = entity.match.sender.id === currentUserId
            ? {
                id: entity.match.receiver.id,
                username: entity.match.receiver.username,
                avatar: entity.match.receiver.avatar
            }
            : {
                id: entity.match.sender.id,
                username: entity.match.sender.username,
                avatar: entity.match.sender.avatar
            };

        this.matchId = entity.match.id;
        this.createdAt = entity.created_at;
        this.updatedAt = entity.updated_at;
    }
}
