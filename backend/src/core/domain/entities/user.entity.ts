import {
    Column,
    Entity, OneToMany, OneToOne,
} from "typeorm";
import {BaseEntity} from "./base.entity";
import {Letters} from "./letter.entity";
import {Matches} from "./match.entity";
import {Reports} from "./report.entity";
import {UserSettings} from "./user-setting.entity";

@Entity()
export class Users extends BaseEntity {

    @Column({length: 100, nullable: false})
    username: string;

    @Column({length: 150, nullable: false, unique: true})
    email: string;

    @Column({nullable: false})
    gender: boolean

    @Column({nullable: true})
    avatar: string;

    @Column({nullable: false})
    password: string;

    @Column({default: false})
    isAdmin: boolean;

    @OneToMany(() => Letters, letters => letters.user)
    letters: Letters[];

    @OneToMany(() => Matches, matchs => matchs.sender)
    sentMatches: Matches[];

    @OneToMany(() => Matches, match => match.receiver)
    receivedMatches: Matches[];

    @OneToOne(() => UserSettings, setting => setting.user)
    settings: UserSettings;

    @OneToMany(() => Reports, report => report.reporter)
    reports: Reports[];
}