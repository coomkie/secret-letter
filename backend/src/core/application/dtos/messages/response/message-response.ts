import {MatchesResponse} from "../../matches/response/match-response";

export class MessagesResponse {
    id: string;
    matchId: string;
    userId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}