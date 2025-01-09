import { UserRole } from 'src/enums/User-Role.enum';
import { Event } from 'src/events/entities/event.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  nick_name?: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PLAYER,
  })
  role: UserRole;

  @Column({ nullable: true })
  national_code?: string;

  @Column({ nullable: true })
  city?: string;

  @OneToMany(() => Event, (event) => event.provider)
  provided_events: Event[];

  @ManyToMany(() => Event, (event) => event.players)
  participated_events: Event[];

  @Column({ nullable: true })
  otp: string;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiration: Date;
}
