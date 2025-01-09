import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { GameRole } from 'src/game_roles/entities/game_role.entity';
import { GameTypes } from 'src/enums/Game-Type.enum';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  baner: string;

  @Column()
  start_time: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  address: string;

  @Column({ default: false })
  is_started: boolean;

  @Column({ type: 'enum', enum: GameTypes, default: GameTypes.CLASSIC })
  game_type: GameTypes;

  @ManyToOne(() => User, (user) => user.provided_events, { nullable: false })
  provider: User;

  @Column()
  player_count: number;

  @ManyToMany(() => User, (user) => user.participated_events, { cascade: true })
  @JoinTable()
  players: User[];
}
