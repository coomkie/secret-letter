import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne} from "typeorm";
import {BaseEntity} from "./base.entity";
import {Letters} from "./letter.entity";
import {Users} from "./user.entity";
import {MatchStatus} from "../enums/match-status.enum";

@Entity()
export class Matches extends BaseEntity {

    @OneToMany(() => Letters, letter => letter.match)
    letters: Letters[];

    @ManyToOne(() => Users, user => user.sentMatches, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'senderId' })
    sender: Users;

    @ManyToOne(() => Users, user => user.receivedMatches, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'receiverId' })
    receiver: Users;

    @Column({
        type: 'enum',
        enum: MatchStatus,
        default: MatchStatus.OPEN,
    })
    status: MatchStatus;
}
