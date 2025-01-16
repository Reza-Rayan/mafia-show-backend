import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';
import { Roles } from './decorators/role.decorator';
import { UserRole } from 'src/enums/User-Role.enum';
import { SearchEventDto } from './dto/search-event.dto';
import { AssignPlayerDto } from './dto/assign-to-game.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Event details including optional banner image',
    type: CreateEventDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The event has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or missing required fields.',
  })
  @UseInterceptors(
    FileInterceptor('baner', {
      storage: diskStorage({
        destination: './uploads/events',
        filename: (_req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Body() createEventDto: CreateEventDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    createEventDto.baner = file ? file.path : null;
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all events' })
  @ApiResponse({ status: 200, description: 'Return list of all events.' })
  @ApiResponse({ status: 404, description: 'No events found.' })
  findAll(
    @Query() searchEventDto: SearchEventDto,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.eventsService.findAll(searchEventDto, { page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific event by ID' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'Event found and returned successfully.',
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing event by ID' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiBody({ type: UpdateEventDto, description: 'Updated event data' })
  @ApiResponse({ status: 200, description: 'Event successfully updated.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or missing required fields.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event by ID' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'Event successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/assign-players')
  @ApiOperation({ summary: 'Assign a player to an event' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiBody({
    description: 'Player assignment details',
    type: AssignPlayerDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Player successfully assigned to the event.',
  })
  @ApiResponse({ status: 404, description: 'Event or player not found.' })
  @ApiResponse({
    status: 400,
    description: 'Player is already assigned or event is full.',
  })
  assignToGame(
    @Param('id') eventId: string,
    @Body() assignPlayerDto: AssignPlayerDto,
  ) {
    const { playerId } = assignPlayerDto;
    return this.eventsService.assignToGame(eventId, playerId);
  }
}
