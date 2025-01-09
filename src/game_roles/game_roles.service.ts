import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameRoleDto } from './dto/create-game_role.dto';
import { UpdateGameRoleDto } from './dto/update-game_role.dto';
import { GameRole } from './entities/game_role.entity';
import { FilterGameRolesDto } from './dto/filter-game_roles.dto'; // Import filter DTO

@Injectable()
export class GameRolesService {
  constructor(
    @InjectRepository(GameRole)
    private readonly gameRoleRepository: Repository<GameRole>,
  ) {}

  // Create Game Role
  async create(createGameRoleDto: CreateGameRoleDto): Promise<GameRole> {
    const existRole = await this.gameRoleRepository.findOne({ where: { title: createGameRoleDto.title } });
    if (existRole) {
      throw new ConflictException('چنین رولی وجود دارد');
    }
    const newGameRole = this.gameRoleRepository.create(createGameRoleDto);
    return await this.gameRoleRepository.save(newGameRole);
  }

  // Find All Game Roles
  async findAll(filter: FilterGameRolesDto): Promise<GameRole[]> {
    const query = this.gameRoleRepository.createQueryBuilder('game_role');

    // Apply role filter if provided
    if (filter.role) {
      query.andWhere('game_role.role = :role', { role: filter.role });
    }

    const gameRoles = await query.getMany();

    if (gameRoles.length === 0) {
      throw new ConflictException('رولی در دیتابیس وجود ندارد');
    }

    return gameRoles;
  }

  // Find Game Role based on ID
  async findOne(id: string): Promise<GameRole> {
    const gameRole = await this.gameRoleRepository.findOne({ where: { id } });
    if (!gameRole) {
      throw new NotFoundException('چنین رولی وجود ندارد');
    }
    return gameRole;
  }

  // Update Game Role
  async update(id: string, updateGameRoleDto: UpdateGameRoleDto): Promise<GameRole> {
    const gameRole = await this.findOne(id);
    if (!gameRole) {
      throw new ConflictException('همچین رولی وجود ندارد');
    }
    const updatedGameRole = Object.assign(gameRole, updateGameRoleDto);
    return await this.gameRoleRepository.save(updatedGameRole);
  }

  // Delete Game Role
  async remove(id: string): Promise<void> {
    const gameRole = await this.findOne(id);
    await this.gameRoleRepository.remove(gameRole);
  }
}
