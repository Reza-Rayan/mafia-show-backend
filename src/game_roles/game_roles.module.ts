import { Module } from '@nestjs/common';
import { GameRolesService } from './game_roles.service';
import { GameRolesController } from './game_roles.controller';
import { GameRole } from './entities/game_role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([GameRole])],
  controllers: [GameRolesController],
  providers: [GameRolesService],
})
export class GameRolesModule {}
