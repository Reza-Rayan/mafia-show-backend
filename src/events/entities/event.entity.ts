import { GameTypes } from 'src/enums/Game-Type.enum';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
  province: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column({ default: false })
  is_started: boolean;
  @Column({ default: false })
  is_super: boolean;

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
