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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PopupService } from './popup.service';
import { CreatePopupDto, UpdatePopupDto } from '../popup/dto/popup.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Define image upload config

@Controller('popup')
export class PopupController {
  constructor(private readonly popupService: PopupService) {}
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', // this folder inside the project
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `popup-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @Post()
  async createPopup(
    @Body() rawBody: Record<string, any>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      rawBody.imagePath = `uploads/${file.filename}`;
      // Save relative path like "uploads/popup-123.png"
    }

    const dto = plainToInstance(CreatePopupDto, rawBody);
    const errors = await validate(dto);
    if (errors.length > 0) {
      const messages = errors.flatMap((err) =>
        Object.values(err.constraints || {}),
      );
      throw new BadRequestException(messages);
    }

    return this.popupService.createPopup(dto);
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
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `popup-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async updatePopup(
    @Param('id') id: string,
    @Body() rawBody: Record<string, any>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      rawBody.imagePath = `uploads/${file.filename}`;
    }

    const dto = plainToInstance(UpdatePopupDto, rawBody);
    const errors = await validate(dto);
    if (errors.length > 0) {
      const messages = errors.flatMap((err) =>
        Object.values(err.constraints || {}),
      );
      throw new BadRequestException(messages);
    }

    return this.popupService.updatePopup(id, dto);
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
