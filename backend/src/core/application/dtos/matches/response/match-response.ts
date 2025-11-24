import {MatchStatus} from "../../../../domain/enums/match-status.enum";
import {MessagesResponse} from "../../messages/response/message-response";

export class MatchesResponse {
    id: string;
    letterId: string;
    senderId: string;
    receiverId: string;
    status: MatchStatus;
    messages: MessagesResponse[];
    createdAt: Date;
    updatedAt: Date;
}