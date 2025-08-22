import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ForDateQuery } from './dto/for-date.query';

@Controller('appointments')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  /** GET /appointments/for-date?date=YYYY-MM-DD  -> { times: string[] } */
  // appointments.controller.ts
  @Get('for-date')
  async forDate(@Query('date') date: string, @Query('offset') offset?: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('date must be YYYY-MM-DD');
    }
    const off = Number.isFinite(Number(offset)) ? Number(offset) : 0; // JS: UTC - local
    const times = await this.service.getTakenTimesForDate(date, off);
    return { times };
  }

  /** POST /appointments  -> create one appointment */
  @Post()
  async create(@Body() dto: CreateAppointmentDto) {
    // optional debug
    // console.log('[AppointmentsController] POST /appointments', dto);
    return this.service.create(dto);
  }

  // NEW: list endpoint consumed by the admin page
  @Get()
  async list(@Query('upcoming') upcoming?: string, @Query('q') q?: string) {
    const onlyUpcoming = upcoming === '1' || upcoming === 'true';
    return this.service.listAll({ upcoming: onlyUpcoming, q });
  }

  // GET /appointments/available?date=YYYY-MM-DD&offset=-180
  @Get('available')
  async available(
    @Query('date') date: string,
    @Query('offset') offset?: string,
  ) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('date must be YYYY-MM-DD');
    }
    const off = Number.isFinite(Number(offset)) ? Number(offset) : 0; // JS: UTC - local (e.g. Cairo summer = -180)
    return this.service.availableTimesForDate(date, off);
  }
}
