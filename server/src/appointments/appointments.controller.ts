// src/appointments/appointments.controller.ts
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
  Delete,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  // Helper to parse "offset" (minutes, where offset = UTC - local; e.g., Cairo summer = -180)
  private parseOffset(offset?: string): number {
    if (offset == null) return 0;
    const n = Number(offset);
    if (!Number.isFinite(n)) {
      throw new BadRequestException(
        'offset must be a number (UTC - local minutes)',
      );
    }
    return Math.trunc(n);
  }

  /**
   * GET /appointments/for-date?date=YYYY-MM-DD&offset=-180
   * Returns TAKEN start times (HH:mm) for that local day.
   * Response: { times: string[] }
   */
  @Get('for-date')
  async forDate(@Query('date') date: string, @Query('offset') offset?: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('date must be YYYY-MM-DD');
    }
    const off = this.parseOffset(offset);
    const times = await this.service.getTakenTimesForDate(date, off);
    return { times };
  }

  /**
   * POST /appointments
   * Body: CreateAppointmentDto { applicationId?, parentEmail?, slotISO }
   * Creates one appointment (enforces: 30-min grid, 09:00–12:00 starts, max 2 per slot).
   * (Emails to Admissions + Parent are sent inside the service after creation.)
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
   * ALIAS: GET /appointments/all
   * Returns full list with no filters. Kept for frontend compatibility.
   */
  @Get('all')
  async listAllAlias() {
    return this.service.listAll({});
  }

  /**
   * ALIAS: GET /appointments/admin-list?upcoming=true&q=foo
   * Same as GET /appointments with optional filters. Kept for frontend compatibility.
   */
  @Get('admin-list')
  async adminList(
    @Query('upcoming') upcoming?: string,
    @Query('q') q?: string,
  ) {
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
  async available(
    @Query('date') date: string,
    @Query('offset') offset?: string,
  ) {
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
  ) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('date must be YYYY-MM-DD');
    }
    const off = this.parseOffset(offset);
    return this.service.availableTimesForDate(date, off);
  }

  /**
   * POST /appointments/pay
   * Starts the Paymob payment flow (returns unified checkout URL).
   */
  @Post('pay')
  async startPayment(@Body() dto: CreateAppointmentDto) {
    return this.service.startPayment(dto);
  }

  /**
   * GET /appointments/callback
   * Paymob redirect handler (will create the appointment on success).
   */
  @Get('callback')
  async paymobRedirect(@Query() query: any, @Res() res: Response) {
    return this.service.handlePaymobRedirect(query, res);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const ok = await this.service.removeById(id);
    if (!ok) throw new NotFoundException('Appointment not found');
    return { ok: true, id };
  }
  // ✅ Step 1: Verification endpoint for Meta
  @Get('webhook')
  verifyWebhook(@Query() query: any, @Res() res: Response) {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WA_VERIFY_TOKEN) {
      console.log('✅ Webhook verified with Meta');
      return res.status(200).send(challenge);
    } else {
      console.warn('❌ Webhook verification failed');
      return res.sendStatus(403);
    }
  }

  // ✅ Step 2: Webhook for incoming messages
  @Post('webhook')
  async handleIncoming(@Body() body: any, @Res() res: Response) {
    console.log('📥 Incoming WA webhook:', JSON.stringify(body, null, 2));

    try {
      const changes = body?.entry?.[0]?.changes?.[0]?.value;
      const messages = changes?.messages;

      if (messages && messages.length > 0) {
        for (const msg of messages) {
          await this.service.handleIncomingMessage(msg);
        }
      }
      return res.sendStatus(200);
    } catch (err) {
      console.error('❌ Error handling WA webhook:', err);
      return res.sendStatus(500);
    }
  }
}
