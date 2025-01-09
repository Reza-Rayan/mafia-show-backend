import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { GameRole } from 'src/enums/Game-Role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGameRoleDto {
  @ApiProperty({
    description: 'The title of the game role',
    example: 'Detective',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  title: string;

  @ApiProperty({
    description: 'A description of the game role',
    example: 'Investigates other players to find the mafia.',
    minLength: 10,
    maxLength: 200,
  })
  @IsNotEmpty()
  @IsString()
  @Length(10, 200)
  description: string;

  @ApiProperty({
    description: 'The category of the game role',
    enum: GameRole,
    example: GameRole.CITIZEN,
  })
  @IsNotEmpty()
  @IsEnum(GameRole, {
    message: `Category must be one of the following values: ${Object.values(GameRole).join(', ')}`,
  })
  role: GameRole;
}
