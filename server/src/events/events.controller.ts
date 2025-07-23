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
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // @UseGuards(JwtAuthGuard)
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

  // @UseGuards(JwtAuthGuard)
  @Put(':title')
  updateByTitle(@Param('title') title: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.updateByTitle(title, dto);
  }
  // @UseGuards(JwtAuthGuard)
  @Delete(':title')
  removeByTitle(@Param('title') title: string) {
    return this.eventsService.removeByTitle(title);
  }
}
