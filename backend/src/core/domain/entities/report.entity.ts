import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import {BaseEntity} from "./base.entity";
import {ReportStatus} from "../enums/report-status.enum";
import {Users} from "./user.entity";
import {Messages} from "./message.entity";
import {Letters} from "./letter.entity";

@Entity()
export class Reports extends BaseEntity {

    @ManyToOne(() => Users, user => user.reports, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'reporter_id'})
    reporter: Users;

    @ManyToOne(() => Messages, {nullable: true, onDelete: 'SET NULL'})
    @JoinColumn({name: 'target_message_id'})
    targetMessage: Messages;

    @ManyToOne(() => Letters, {nullable: true, onDelete: 'SET NULL'})
    @JoinColumn({name: 'target_letter_id'})
    targetLetter: Letters;

    @Column('text')
    reason: string;

    @Column({
        type: 'enum',
        enum: ReportStatus,
        default: ReportStatus.PENDING,
    })
    status: ReportStatus;
}

