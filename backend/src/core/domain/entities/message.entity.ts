import {BaseEntity} from "./base.entity";
import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {Matches} from "./match.entity";
import {Users} from "./user.entity";

@Entity()
export class Messages extends BaseEntity {

    @ManyToOne(() => Matches, match => match.messages, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'matchId'})
    match: Matches;

    @ManyToOne(() => Users, user => user.id)
    @JoinColumn({name: 'sender_id'})
    sender: Users;

    @Column('text')
    content: string;
}