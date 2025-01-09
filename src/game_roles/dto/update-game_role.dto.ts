import { PartialType } from '@nestjs/swagger';
import { CreateGameRoleDto } from './create-game_role.dto';

export class UpdateGameRoleDto extends PartialType(CreateGameRoleDto) {}
