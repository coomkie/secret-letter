import {Letters} from "../../../domain/entities/letter.entity";
import {CreateLetterRequest} from "../../dtos/letters/request/create-letter-request";
import {GetAllLetterAdminRequest} from "../../dtos/letters/request/get-all-letter-admin-request";
import {GetAllLetterReceivedRequest} from "../../dtos/letters/request/get-all-letter-received-request";
import {GetAllLetterSentRequest} from "../../dtos/letters/request/get-all-letter-sent-request";
import {SendRandomLetterRequest} from "../../dtos/letters/request/send-letter-random-request";
import {ReplyLetterRequest} from "../../dtos/letters/request/reply-letter.-request";

export interface ILettersRepository {
    createLetter(data: CreateLetterRequest): Promise<Letters>;

    createRandomLetter(senderId: string, data: SendRandomLetterRequest): Promise<Letters>

    replyLetter(senderId: string, data: ReplyLetterRequest): Promise<Letters>

    getAllLetterAdmin(req: GetAllLetterAdminRequest): Promise<{
        items: Letters[];
        total: number;
        page: number;
        pageSize: number;
    }>;

    getAllLetterReceived(
        userId: string,
        req: GetAllLetterReceivedRequest,
    ): Promise<{
        items: Letters[];
        total: number;
        page: number;
        pageSize: number;
    }>;

    getAllLetterSent(
        userId: string,
        req: GetAllLetterSentRequest,
    ): Promise<{
        items: Letters[];
        total: number;
        page: number;
        pageSize: number;
    }>;

    getLetterByUserId(id: string): Promise<Letters | null>;

    deleteLetter(id: string): Promise<void>;

    count(options: any): Promise<number>;

    countReceivedLetters(userId: string): Promise<number>;

    countDistinctConnections(userId: string): Promise<number>;

    countUnreadLetters(userId: string): Promise<number>;

    markAsRead(letterId: string, userId: string): Promise<void>;
}
