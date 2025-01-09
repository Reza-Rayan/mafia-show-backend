import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @ApiProperty({
    example: ['a7c9c9a3-d1b9-45ea-b94f-f98b2e33ea6b', 'b8d8c9b7-a1b1-48f1-c7a1-df2e7e11f9ab'],
    description: 'An array of UUIDs representing the players for this event.',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { each: true })
  players?: string[];
}
