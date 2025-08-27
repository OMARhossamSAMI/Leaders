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
import { Response } from 'express';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ForDateQuery } from './dto/for-date.query';
import { Response } from 'express';

@Controller('appointments')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  // Small helper to parse "offset" (minutes, where offset = UTC - local; e.g., Cairo summer = -180)
  private parseOffset(offset?: string): number {
    if (offset == null) return 0;
    const n = Number(offset);
    if (!Number.isFinite(n)) {
      throw new BadRequestException('offset must be a number (UTC - local minutes)');
    }
    return Math.trunc(n);
  }

  /**
   * GET /appointments/for-date?date=YYYY-MM-DD&offset=-180
   * Returns the TAKEN start times (HH:mm) for that local day.
   * NOTE: This returns taken times, not available ones.
   * Response: { times: string[] }
   */
  @Get('for-date')
  async forDate(@Query('date') date: string, @Query('offset') offset?: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('date must be YYYY-MM-DD');
    }
    const off = this.parseOffset(offset); // JS: UTC - local
    const times = await this.service.getTakenTimesForDate(date, off);
    return { times };
  }

  /**
   * POST /appointments
   * Body: CreateAppointmentDto { applicationId?, parentEmail?, slotISO }
   * Creates one appointment (enforces: 30-min grid, 09:00–12:00 starts, max 2 per slot).
   */
  @Post()
  async create(@Body() dto: CreateAppointmentDto) {
    return this.service.create(dto);
  }

  /**
   * GET /appointments?upcoming=true&q=foo
   * Admin listing (optionally upcoming-only and/or search by parentEmail).
   */
  @Get()
  async list(@Query('upcoming') upcoming?: string, @Query('q') q?: string) {
    const onlyUpcoming = upcoming === '1' || upcoming === 'true';
    return this.service.listAll({ upcoming: onlyUpcoming, q });
  }

  /**
   * GET /appointments/available?date=YYYY-MM-DD&offset=-180
   * Returns AVAILABLE 30-min start times (HH:mm) for that local day.
   * - Hides full slots (>= 2 bookings)
   * - If date is today (local), hides past times (rounded to next half hour)
   * Response: { times: string[] }
   */
  @Get('available')
  async available(@Query('date') date: string, @Query('offset') offset?: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('date must be YYYY-MM-DD');
    }
    const off = this.parseOffset(offset);
    return this.service.availableTimesForDate(date, off);
  }

  /**
   * DEPRECATED ALIAS (kept for compatibility):
   * GET /appointments/available-for-date?date=YYYY-MM-DD&offset=-180
   * Same output as /appointments/available
   */
  @Get('available-for-date')
  async availableForDate(
    @Query('date') date: string,
    @Query('offset') offset?: string,
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

  @Get('callback')
  async paymobRedirect(@Query() query: any, @Res() res: Response) {
    return this.service.handlePaymobRedirect(query, res);
  }
}
