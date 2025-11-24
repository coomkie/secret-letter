import {LettersResponse} from "../../letters/response/letter-response";
import {MatchNoMessagesResponse} from "../../matches/response/match-no-message-response";
import {UserSettingsResponse} from "../../userSettings/response/userSetting-response";
import {ReportsResponse} from "../../reports/response/report-response";
import {Users} from "../../../../domain/entities/user.entity";

export class UserResponse {
    id: string;
    username: string;
    gender: boolean;
    email: string;
    avatar: string;
    password: string;
    isAdmin: boolean;
    letters: LettersResponse[];
    sentMatches: MatchNoMessagesResponse[];
    receivedMatches: MatchNoMessagesResponse[];
    userSetting: UserSettingsResponse;
    reports: ReportsResponse[];
    created_at: Date;
    updated_at: Date;


    constructor(entity: Users) {
        this.id = entity.id;
        this.username = entity.username;
        this.gender = entity.gender;
        this.email = entity.email;
        this.avatar = entity.avatar;
        this.password = entity.password;
        this.isAdmin = entity.isAdmin;
        this.letters = Array.isArray(entity.letters)
            ? entity.letters
                .filter(letter => !!letter)
                .map(letter => new LettersResponse(letter))
            : [];
        this.sentMatches = Array.isArray(entity.sentMatches)
            ? entity.sentMatches
                .filter(sentMatch => !!sentMatch)
                .map(sentMatch => new MatchNoMessagesResponse(sentMatch))
            : [];
        this.receivedMatches = Array.isArray(entity.receivedMatches)
            ? entity.receivedMatches
                .filter(receivedMatch => !!receivedMatch)
                .map(receivedMatch => new MatchNoMessagesResponse(receivedMatch))
            : [];
        this.userSetting = new UserSettingsResponse(entity.settings);
        this.reports = Array.isArray(entity.reports)
            ? entity.reports
                .filter(report => !!report)
                .map(report => new ReportsResponse(report))
            : [];
        this.created_at = entity.created_at;
        this.updated_at = entity.updated_at;
    }
}
