import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContactUsService } from './contactus.service';
import { CreateContactUsDto } from './dto/create-contactus.dto';
import { UpdateContactUsDto } from './dto/update-contactus.dto';

@Controller('contactus')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  async create(@Body() createDto: CreateContactUsDto) {
    return this.contactUsService.create(createDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.contactUsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactUsService.findOne(id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id/reviewed')
  markAsReviewed(@Param('id') id: string, @Body('reviewed') reviewed: boolean) {
    return this.contactUsService.update(id, { reviewed });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactUsService.remove(id);
  }
}
