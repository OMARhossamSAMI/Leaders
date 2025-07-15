// src/settings/settings.controller.ts
import { Controller, Get, Put, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('show-events')
  getShowEvents() {
    return this.settingsService.getSettings();
  }

  @Put('show-events')
  updateShowEvents(@Body() body: { showEvents: boolean }) {
    return this.settingsService.updateShowEvents(body.showEvents);
  }
}
