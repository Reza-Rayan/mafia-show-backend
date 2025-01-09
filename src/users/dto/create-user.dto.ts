import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
import { UserRole } from 'src/enums/User-Role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  name?: string;

  @ApiProperty({
    description: 'The nickname of the user',
    example: 'Johnny',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 30)
  nick_name?: string;

  @ApiProperty({
    description: 'The user’s phone number',
    example: '+123456789',
  })
  @IsNotEmpty()
  @IsString()
  @Length(11)
  phone: string;

  @ApiProperty({
    description: 'The avatar URL of the user',
    example: 'http://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'A short bio for the user',
    example: 'Passionate gamer and streamer.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(10, 200)
  bio?: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'johndoe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    example: UserRole.PLAYER,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, {
    message: `Role must be one of the following values: ${Object.values(UserRole).join(', ')}`,
  })
  role?: UserRole;

  @ApiProperty({
    description: 'The national code of the user',
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(10, 10)
  national_code?: string;

  @ApiProperty({
    description: 'The city where the user lives',
    example: 'New York',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  city?: string;
}
