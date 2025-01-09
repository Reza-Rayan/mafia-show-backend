import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignPlayerDto {
  @ApiProperty({ description: 'ID of the player to assign' })
  @IsNotEmpty()
  @IsUUID()
  playerId: string;
}
