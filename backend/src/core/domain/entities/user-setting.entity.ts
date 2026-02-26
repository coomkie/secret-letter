import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Users } from './user.entity';

@Entity()
export class UserSettings extends BaseEntity {
  @OneToOne(() => Users, (user) => user.settings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column({ default: true })
  allowRandomMessages: boolean;

  @Column({ type: 'jsonb', nullable: true })
  preferredMoods: string[];

  @Column({ default: true })
  notificationsEnabled: boolean;
}
