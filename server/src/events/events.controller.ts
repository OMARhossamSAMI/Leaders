import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @Get()
  findAllAdmin() {
    return this.eventsService.findAllAdmin();
  }

  @Get('visible')
  findVisibleOnWebsite() {
    return this.eventsService.findVisibleOnWebsite();
  }

  @Get('notice')
  upcomingNotice() {
    return this.eventsService.upcomingVisibleNotice();
  }

  @Get(':title')
  findByTitle(@Param('title') title: string) {
    return this.eventsService.findByTitle(title);
  }

  @Put(':title')
  updateByTitle(@Param('title') title: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.updateByTitle(title, dto);
  }

  @Delete(':title')
  removeByTitle(@Param('title') title: string) {
    return this.eventsService.removeByTitle(title);
  }
}
