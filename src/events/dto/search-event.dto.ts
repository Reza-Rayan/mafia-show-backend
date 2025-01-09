import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GameTypes } from 'src/enums/Game-Type.enum';

export class SearchEventDto {
  @ApiProperty({
    required: false,
    description: 'Filter events by title',
    example: 'Chess Tournament',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    required: false,
    description: 'Filter events by game type',
    example: GameTypes.CLASSIC,
  })
  @IsOptional()
  @IsEnum(GameTypes)
  game_type?: GameTypes;
}
