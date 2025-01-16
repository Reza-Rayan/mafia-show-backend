import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/enums/User-Role.enum';
import { Roles } from './decorators/role.decorator';
import { CreateGameRoleDto } from './dto/create-game_role.dto';
import { FilterGameRolesDto } from './dto/filter-game_roles.dto'; // Import filter DTO
import { UpdateGameRoleDto } from './dto/update-game_role.dto';
import { GameRole } from './entities/game_role.entity';
import { GameRolesService } from './game_roles.service';

@UseGuards(JwtAuthGuard)
@Roles(UserRole.ADMIN)
@ApiTags('game-roles')
@Controller('game-roles')
export class GameRolesController {
  constructor(private readonly gameRolesService: GameRolesService) {}

  @Post()
  @ApiOperation({ summary: 'ایجاد یک نقش جدید در بازی' })
  @ApiResponse({
    status: 201,
    description: 'نقش بازی با موفقیت ایجاد شد.',
    type: GameRole,
  })
  @ApiResponse({ status: 400, description: 'داده‌های نامعتبر ارائه شده است.' })
  create(@Body() createGameRoleDto: CreateGameRoleDto) {
    return this.gameRolesService.create(createGameRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'دریافت تمام نقش‌های بازی' })
  @ApiResponse({
    status: 200,
    description: 'لیست نقش‌های بازی',
    type: [GameRole],
  })
  findAll(@Query() filter: FilterGameRolesDto) {
    return this.gameRolesService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت نقش بازی با شناسه' })
  @ApiParam({ name: 'id', description: 'شناسه نقش بازی برای دریافت' })
  @ApiResponse({ status: 200, description: 'جزئیات نقش بازی', type: GameRole })
  @ApiResponse({ status: 404, description: 'نقش بازی پیدا نشد' })
  findOne(@Param('id') id: string) {
    return this.gameRolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'به‌روزرسانی نقش بازی با شناسه' })
  @ApiParam({ name: 'id', description: 'شناسه نقش بازی برای به‌روزرسانی' })
  @ApiResponse({
    status: 200,
    description: 'نقش بازی به‌روزرسانی شده',
    type: GameRole,
  })
  @ApiResponse({ status: 404, description: 'نقش بازی پیدا نشد' })
  update(
    @Param('id') id: string,
    @Body() updateGameRoleDto: UpdateGameRoleDto,
  ) {
    return this.gameRolesService.update(id, updateGameRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف نقش بازی با شناسه' })
  @ApiParam({ name: 'id', description: 'شناسه نقش بازی برای حذف' })
  @ApiResponse({ status: 200, description: 'نقش بازی با موفقیت حذف شد.' })
  @ApiResponse({ status: 404, description: 'نقش بازی پیدا نشد' })
  remove(@Param('id') id: string) {
    return this.gameRolesService.remove(id);
  }
}
