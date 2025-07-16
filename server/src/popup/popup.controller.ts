import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PopupService } from './popup.service';
import { CreatePopupDto, UpdatePopupDto } from '../popup/dto/popup.dto';

@Controller('popup')
export class PopupController {
  constructor(private readonly popupService: PopupService) {}

  @Post()
  async createPopup(@Body() body: CreatePopupDto) {
    return this.popupService.createPopup(body);
  }

  @Get()
  async getAllPopups() {
    return this.popupService.getAllPopups();
  }
  @Get(':id')
  async getPopupById(@Param('id') id: string) {
    return this.popupService.getPopupById(id);
  }

  @Put(':id')
  async updatePopup(@Param('id') id: string, @Body() body: UpdatePopupDto) {
    return this.popupService.updatePopup(id, body);
  }

  @Delete(':id')
  async deletePopup(@Param('id') id: string) {
    return this.popupService.deletePopup(id);
  }

  @Patch('toggle/:id')
  async togglePopupStatus(@Param('id') id: string) {
    return this.popupService.togglePopupStatus(id);
  }
  @Get('live/only')
  async getLivePopup() {
    return this.popupService.getLivePopup();
  }
}
