import {MatchStatus} from "../../../../domain/enums/match-status.enum";
import {Matches} from "../../../../domain/entities/match.entity";

export class MatchNoMessagesResponse {
    id: string;
    letterId: string;
    senderId: string;
    receiverId: string;
    status: MatchStatus;
    messagesId: string[];
    createdAt: Date;
    updatedAt: Date;

    constructor(entity: Matches) {
        this.id = entity.id;
        this.letterId = entity.letter.id;
        this.receiverId = entity.receiver.id;
        this.status = entity.status;
        this.messagesId = Array.isArray(entity.messages)
            ? entity.messages
                .filter(message => !!message)
                .map(receivedMatch => receivedMatch.id)
            : [];
        this.createdAt = entity.created_at;
        this.updatedAt = entity.updated_at;
    }
}