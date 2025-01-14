import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
// --------------------------------------------------------------------------------------------------------
import { UserRole } from 'src/enums/User-Role.enum';
import { User } from 'src/users/entities/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { SearchEventDto } from './dto/search-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { log } from 'console';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private eventsRepository: Repository<Event>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  // Create an Event
  async create(createEventDto: CreateEventDto) {
    const { providerId, ...eventData } = createEventDto;
    const provider = await this.usersRepository.findOne({
      where: { id: providerId },
    });
    // Check user exist
    if (!provider) {
      throw new NotFoundException(`کاربر پیدا نشد`);
    }
    // Check user role
    if (
      provider.role !== UserRole.PROVIDER &&
      provider.role !== UserRole.ADMIN
    ) {
      throw new BadRequestException(
        'دسترسی شما به عنوان گرداننده تعیین نشده است.',
      );
    }
    if (Number(eventData.player_count) === 0) {
      throw new BadRequestException('تعداد افراد بازی نمی تواند صفر باشد.');
    }

    const newEvent = this.eventsRepository.create({
      ...eventData,
      provider,
      is_started: false,
      players: [],
    });
    const event = await this.eventsRepository.save(newEvent);
    return {
      message: 'Created successfully',
      event,
    };
  }
  // End here

  // find events
  async findAll(
    searchEventDto: SearchEventDto,
    options: IPaginationOptions,
  ): Promise<Pagination<Event>> {
    const { title, game_type } = searchEventDto;

    const queryBuilder = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.provider', 'provider')
      .leftJoinAndSelect('event.players', 'players');

    // Apply filters
    if (title) {
      queryBuilder.andWhere('event.title LIKE :title', { title: `%${title}%` });
    }
    if (game_type) {
      queryBuilder.andWhere('event.game_type = :game_type', { game_type });
    }

    // Paginate results
    return paginate<Event>(queryBuilder, options);
  }

  // Find event by id
  async findOne(id: string) {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['provider', 'players'],
    });

    if (!event) {
      throw new NotFoundException('ایونت مورد نظر یافت نشد');
    }
    return event;
  }

  // Update event
  async update(id: string, updateEventDto: UpdateEventDto) {
    // Retrieve the event by ID
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['players'],
    });

    // Check if the event exists
    if (!event) {
      throw new NotFoundException('ایونت مورد نظر یافت نشد');
    }

    const { players, ...eventData } = updateEventDto;
    const updatedEvent = await this.eventsRepository.merge(event, eventData);

    return {
      message: 'ایونت با موفقیت بروزرسانی شد',
      event: updatedEvent,
    };
  }

  // Remove event
  async remove(id: string) {
    const event = await this.findOne(id);

    if (!event) {
      throw new NotFoundException('ایونت مورد نظر یافت نشد');
    }
    await this.eventsRepository.delete(id);
    return {
      message: 'ایونت مورد نظر حذف شد',
    };
  }

  // Assign a player to a game
  async assignToGame(eventId: string, playerId: string) {
    // Find the event
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
      relations: ['players'],
    });

    if (!event) {
      throw new NotFoundException('ایونت مورد نظر یافت نشد');
    }

    // Find the player
    const player = await this.usersRepository.findOne({
      where: { id: playerId },
    });

    if (!player) {
      throw new NotFoundException('کاربر پیدا نشد');
    }

    // Check if the player is already assigned to the game
    if (event.players.some((p) => p.id === player.id)) {
      throw new BadRequestException(
        'این بازیکن قبلاً به این ایونت اضافه شده است.',
      );
    }

    // Check if there is room for more players
    if (event.player_count <= 0) {
      throw new BadRequestException('ظرفیت بازیکنان این ایونت پر شده است.');
    }

    // Add the player to the players array
    event.players.push(player);

    event.player_count -= 1;

    // Save the updated event
    await this.eventsRepository.save(event);

    return {
      message: 'بازیکن با موفقیت به ایونت اضافه شد',
      event,
    };
  }
  // End here
}
