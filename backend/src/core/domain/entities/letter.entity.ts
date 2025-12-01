import {Column, Entity, ManyToOne, OneToOne} from "typeorm";
import {BaseEntity} from "./base.entity";
import {Mood} from "../enums/mood.enum";
import {Users} from "./user.entity";
import {Matches} from "./match.entity";

@Entity()
export class Letters extends BaseEntity {

    @Column('text', { nullable: false })
    content: string;

    @Column({
        type: 'enum',
        enum: Mood,
        default: Mood.NEUTRAL,
        nullable: false
    })
    mood: Mood;

    @Column({ default: false })
    isSent: boolean;

    @ManyToOne(() => Users, user => user.letters, { onDelete: "CASCADE" })
    user: Users;

    @ManyToOne(() => Matches, match => match.letters, {
        onDelete: 'CASCADE'
    })
    match: Matches;
}
