// src/settings/settings.controller.ts
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Put('amount')
  updateAmount(@Body() body: { amount: number }) {
    return this.settingsService.updateAmount(body.amount);
  }

  // ---- ADMISSION ----
  @Get('admission-closed')
  async getAdmissionClosed() {
    const settings = await this.settingsService.getSettings();
    return { admissionClosed: settings.admissionClosed };
  }

  @UseGuards(JwtAuthGuard)
  @Put('admission-closed')
  updateAdmissionClosed(@Body() body: { admissionClosed: boolean }) {
    return this.settingsService.updateAdmissionClosed(body.admissionClosed);
  }
}
