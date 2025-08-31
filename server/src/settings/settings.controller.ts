// src/settings/settings.controller.ts
import { Controller, Get, Put, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getAllSettings() {
    return this.settingsService.getSettings();
  }

  // ---- EVENTS ----
  @Get('show-events')
  getShowEvents() {
    return this.settingsService.getSettings();
  }

  @Put('show-events')
  updateShowEvents(@Body() body: { showEvents: boolean }) {
    return this.settingsService.updateShowEvents(body.showEvents);
  }

  // ---- APPOINTMENTS ----
  @Get('show-appointments')
  async getShowAppointments() {
    const settings = await this.settingsService.getSettings();
    return { showAppointments: settings.showAppointments };
  }

  @Put('show-appointments')
  updateShowAppointments(@Body() body: { showAppointments: boolean }) {
    return this.settingsService.updateShowAppointments(body.showAppointments);
  }
  // ---- AMOUNT ----
  @Get('amount')
  async getAmount() {
    const settings = await this.settingsService.getSettings();
    return { amount: settings.amount };
  }

  @Put('amount')
  updateAmount(@Body() body: { amount: number }) {
    return this.settingsService.updateAmount(body.amount);
  }
}
