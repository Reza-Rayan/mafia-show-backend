import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GameTypes } from 'src/enums/Game-Type.enum';
import { UserRole } from 'src/enums/User-Role.enum';

export class SearchUserDTO {
  @ApiProperty({
    required: false,
    description: 'Filter events by name',
    example: 'Write Name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Filter users by user role',
    example: UserRole.PLAYER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
