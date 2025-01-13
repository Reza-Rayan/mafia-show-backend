import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/enums/User-Role.enum';
import { GameTypes } from 'src/enums/Game-Type.enum';
import { SearchEventDto } from './dto/search-event.dto';

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

    console.log('new event', eventData);

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
  async findAll(searchEventDto: SearchEventDto) {
    const { title, game_type } = searchEventDto;

    const queryBuilder = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.provider', 'provider')
      .leftJoinAndSelect('event.players', 'players');

    // Apply filters based on the DTO
    if (title) {
      queryBuilder.andWhere('event.title LIKE :title', { title: `%${title}%` });
    }
    if (game_type) {
      queryBuilder.andWhere('event.game_type = :game_type', { game_type });
    }

    const events = await queryBuilder.getMany();

    if (events.length === 0) {
      return {
        message: 'ایونتی وجود ندارد',
      };
    }

    return events;
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
    // Find the existing event by its ID
    const event = await this.findOne(id);
    if (!event) {
      throw new NotFoundException('ایونت مورد نظر یافت نشد');
    }

    // Exclude the `players` property from being updated
    const { players, ...eventData } = updateEventDto;

    // Merge the existing event with the new data (excluding `players`)
    const updatedEvent = this.eventsRepository.merge(event, eventData);

    // Save the updated event to the database
    await this.eventsRepository.save(updatedEvent);

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
