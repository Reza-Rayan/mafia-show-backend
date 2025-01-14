import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUUID,
  Min,
  IsEnum,
} from 'class-validator';
import { GameTypes } from 'src/enums/Game-Type.enum';

export class CreateEventDto {
  @ApiProperty({
    example: 'Event Title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '2024-11-15T12:00:00Z',
  })
  @IsString()
  @IsNotEmpty()
  start_time: string;

  @ApiProperty({
    required: false,
    example: 'This is a sample description of the event',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Jahad Square' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Tehran' })
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiProperty({ example: 'Tehran' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    example: 'image.jpg',
  })
  @IsOptional()
  baner?: string;

  @ApiProperty({
    example: GameTypes.CLASSIC,
    enum: GameTypes,
    description: 'Type of the game being played.',
  })
  @IsNotEmpty()
  @IsEnum(GameTypes)
  game_type: GameTypes;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  providerId: string;

  @ApiProperty({
    example: 2,
    description: 'The number of players required, must be at least 2.',
  })
  @IsNotEmpty()
  player_count: number;

  @ApiProperty({
    type: [String],
    example: [
      'a7c9c9a3-d1b9-45ea-b94f-f98b2e33ea6b',
      'b8d8c9b7-a1b1-48f1-c7a1-df2e7e11f9ab',
    ],
    description:
      'An array of UUIDs representing the players participating in the event.',
  })
  @IsOptional()
  @IsUUID('4', { each: true })
  players?: string[];
}
