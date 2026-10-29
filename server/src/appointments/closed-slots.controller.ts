// src/appointments/closed-slots.controller.ts
import { Controller, Get, Post, Body, Query, BadRequestException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('closed-slots')
export class ClosedSlotsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  /** Get all closed slots, or for a specific date if provided */
  @Get()
  async getAll(@Query('date') date?: string) {
    try {
      return await this.appointmentsService.getClosedSlots(date);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  /** Mark a slot as closed (admin) */
  @Post('close')
  async closeSlot(@Body() body: { date: string; time: string; reason?: string }) {
    if (!body.date || !body.time)
      throw new BadRequestException('date and time are required');
    return await this.appointmentsService.closeSlot(body);
  }

  /** Reopen a closed slot (admin) */
  @Post('reopen')
  async reopenSlot(@Body() body: { date: string; time: string }) {
    if (!body.date || !body.time)
      throw new BadRequestException('date and time are required');
    return await this.appointmentsService.reopenSlot(body);
  }
}
