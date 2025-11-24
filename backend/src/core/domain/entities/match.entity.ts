import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne} from "typeorm";
import {BaseEntity} from "./base.entity";
import {Letters} from "./letter.entity";
import {Users} from "./user.entity";
import {MatchStatus} from "../enums/match-status.enum";
import {Messages} from "./message.entity";

@Entity()
export class Matches extends BaseEntity {

    @OneToOne(() => Letters, letter => letter.match, {onDelete: 'CASCADE'})
    @JoinColumn()
    letter: Letters;

    @ManyToOne(() => Users, user => user.sentMatches, {onDelete: 'SET NULL'})
    @JoinColumn({name: 'senderId'})
    sender: Users;

    @ManyToOne(() => Users, user => user.receivedMatches, {onDelete: 'SET NULL'})
    @JoinColumn({name: 'receiverId'})
    receiver: Users;

    @Column({
        type: 'enum',
        enum: MatchStatus,
        default: MatchStatus.OPEN,
    })
    status: MatchStatus;

    @OneToMany(() => Messages, msg => msg.match)
    messages: Messages[];
}
