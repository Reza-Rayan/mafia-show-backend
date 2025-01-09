import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GameRole as Role } from 'src/enums/Game-Role.enum';

export enum Category {
  MAFIA = 'Mafia',
  CITIZEN = 'Citizen',
  INDEPENDENT = 'Independent',
}

@Entity()
export class GameRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CITIZEN,
  })
  role: Role;
}
