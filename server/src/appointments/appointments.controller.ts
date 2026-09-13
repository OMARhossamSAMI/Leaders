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
import { ClosedSlotDto } from './dto/closed-slot.dto';

@Controller('appointments')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  // Helper for timezone offset parsing
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

  // ------------------------------------------------------------
  // 📅 CLOSED SLOTS MANAGEMENT (ADMIN)
  // ------------------------------------------------------------

  /** POST /appointments/closed — close a slot */
  @Post('closed')
  async closeSlot(@Body() body: { date: string; time: string }) {
    if (!body.date || !body.time) {
      throw new BadRequestException('Date and time are required');
    }
    return this.service.closeSlot(body);
  }

  @Delete('closed')
  async reopenSlot(@Body() body: { date: string; time: string }) {
    if (!body.date || !body.time) {
      throw new BadRequestException('Date and time are required');
    }
    return this.service.reopenSlot(body);
  }

  /** GET /appointments/closed?date=YYYY-MM-DD — list closed slots */
  @Get('closed')
  async getClosedSlots(@Query('date') date?: string) {
    return this.service.getClosedSlots(date);
  }

  // ------------------------------------------------------------
  // APPOINTMENT CORE ENDPOINTS
  // ------------------------------------------------------------

  @Get('for-date')
  async forDate(@Query('date') date: string, @Query('offset') offset?: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
      throw new BadRequestException('date must be YYYY-MM-DD');
    const off = this.parseOffset(offset);
    const times = await this.service.getTakenTimesForDate(date, off);
    return { times };
  }

  @Post()
  async create(@Body() dto: CreateAppointmentDto) {
    return this.service.create(dto);
  }

  @Get()
  async list(@Query('upcoming') upcoming?: string, @Query('q') q?: string) {
    const onlyUpcoming = upcoming === '1' || upcoming === 'true';
    return this.service.listAll({ upcoming: onlyUpcoming, q });
  }

  @Get('all')
  async listAllAlias() {
    return this.service.listAll({});
  }

  @Get('admin-list')
  async adminList(
    @Query('upcoming') upcoming?: string,
    @Query('q') q?: string,
  ) {
    const onlyUpcoming = upcoming === '1' || upcoming === 'true';
    return this.service.listAll({ upcoming: onlyUpcoming, q });
  }

  @Get('available')
  async available(
    @Query('date') date: string,
    @Query('offset') offset?: string,
  ) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
      throw new BadRequestException('date must be YYYY-MM-DD');
    const off = this.parseOffset(offset);
    return this.service.availableTimesForDate(date, off);
  }

  @Get('available-for-date')
  async availableForDate(
    @Query('date') date: string,
    @Query('offset') offset?: string,
  ) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
      throw new BadRequestException('date must be YYYY-MM-DD');
    const off = this.parseOffset(offset);
    return this.service.availableTimesForDate(date, off);
  }

  @Post('pay')
  async startPayment(@Body() dto: CreateAppointmentDto) {
    return this.service.startPayment(dto);
  }

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

  // ------------------------------------------------------------
  // ✅ META WHATSAPP WEBHOOK ENDPOINTS
  // ------------------------------------------------------------

  /** Step 1: Verification endpoint for Meta (GET webhook) */
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

  /** Step 2: Receive messages from WhatsApp (POST webhook) */
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
  @Get('test-conversion')
  async testConversion(@Query('slotISO') slotISO: string) {
    return this.service.testConversion(slotISO);
  }
}
