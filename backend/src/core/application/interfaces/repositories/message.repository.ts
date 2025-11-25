import {Messages} from "../../../domain/entities/message.entity";
import {CreateMessageRequest} from "../../dtos/messages/request/create-message-request";

export interface IMessagesRepository {
    createMessage(matchId: string, senderId: string, data: CreateMessageRequest): Promise<Messages>;

    getMessagesByMatchId(matchId: string): Promise<Messages[]>;

    isUserInMatch(matchId: string, userId: string): Promise<boolean>;
}
