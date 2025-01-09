import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from './role.guard';
import { Roles } from './decorators/role.decorator';
import { UserRole } from 'src/enums/User-Role.enum';
import { SearchUserDTO } from './dto/search-user.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User, // Optional: Return type (for creating user, it's the created user)
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users.',
    type: [User], // This indicates an array of User entities
  })
  findAll(@Query() searchUserDTO: SearchUserDTO) {
    return this.usersService.findAll(searchUserDTO);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The user data.',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id/request-provider')
  @ApiOperation({
    summary: 'Request to be a provider by changing role to PENDING',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The user has successfully requested to be a provider.',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 400,
    description:
      'User role cannot be changed to PENDING if already in PENDING or another status',
  })
  async requestProvider(@Param('id') id: string) {
    const updatedUser = await this.usersService.changeRoleToPending(id);
    return updatedUser;
  }

  @Patch(':id/accept-pending')
  @ApiOperation({
    summary: 'Accept a pending user and change their role to PROVIDER',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The user has successfully been updated to PROVIDER.',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found or user is not in pending state',
  })
  acceptPendingUser(@Param('id') id: string) {
    return this.usersService.acceptPendingUser(id);
  }
}
