import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ForDateQuery } from './dto/for-date.query';
import { Response } from 'express';

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

  // Return AVAILABLE times, not taken ones
  @Get('available-for-date')
  async availableForDate(
    @Query('date') date: string, // YYYY-MM-DD in user's local calendar
    @Query('offset') offset?: string, // minutes, where offset = UTC - local
  ) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('date must be YYYY-MM-DD');
    }
    const off = Number(offset ?? '0');
    if (!Number.isFinite(off)) {
      throw new BadRequestException(
        'offset must be a number (UTC - local minutes)',
      );
    }
    return this.service.availableTimesForDate(date, off);
  }
  // appointments.controller.ts
  @Post('pay')
  async startPayment(@Body() dto: CreateAppointmentDto) {
    return this.service.startPayment(dto);
  }
  // appointments.controller.ts
  @Post('callback')
  async paymobCallback(@Body() body: any, @Res() res: Response) {
    return this.service.handlePaymobCallback(body, res);
  }
}
