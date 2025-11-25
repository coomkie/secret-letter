import {MatchStatus} from "../../../../domain/enums/match-status.enum";
import {MessagesResponse} from "../../messages/response/message-response";
import {Matches} from "../../../../domain/entities/match.entity";

export class MatchesResponse {
    id: string;
    letterId: string | null;
    senderId: string;
    receiverId: string;
    status: MatchStatus;
    messages: MessagesResponse[];
    createdAt: Date;
    updatedAt: Date;

    constructor(entity: Matches) {
        this.id = entity.id;
        this.letterId = entity.letter?.id ?? null;
        this.senderId = entity.sender.id;
        this.receiverId = entity.receiver.id;
        this.status = entity.status;
        this.messages = Array.isArray(entity.messages)
            ? entity.messages
                .filter(message => !!message)
                .map(message => new MessagesResponse(message))
            : [];
        this.createdAt = entity.created_at;
        this.updatedAt = entity.updated_at;
    }
}


