import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { GameRole } from 'src/game_roles/entities/game_role.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Event,User,GameRole])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
