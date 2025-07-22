import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  BadRequestException,
  Delete,
  Get,
  Param,
} from '@nestjs/common';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { InternshipService } from './internship.service';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { Internship } from '../Schemas/internship.schema';
import { Express } from 'express';

@Controller('internship')
export class InternshipController {
  constructor(private readonly internshipService: InternshipService) {}

   @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cv_file', maxCount: 1 },
      { name: 'cover_letter', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles()
    files: {
      cv_file?: Express.Multer.File[];
      cover_letter?: Express.Multer.File[];
    },
    @Body() body: any,
  ): Promise<Internship> {
    const {
      full_name,
      email,
      phone,
      university,
      degree,
      year_of_study,
      start_date,
      duration,
      motivation,
    } = body;

    if (
      !full_name ||
      !email ||
      !phone ||
      !university ||
      !degree ||
      !year_of_study ||
      !start_date ||
      !duration
    ) {
      throw new BadRequestException('Missing required fields.');
    }

    const dto: CreateInternshipDto = {
      full_name,
      email,
      phone,
      university,
      degree,
      year_of_study: Number(year_of_study),
      start_date: new Date(start_date),
      duration,
      motivation,
      cv_file_url: files.cv_file?.[0]?.originalname || '',
      cover_letter_url: files.cover_letter?.[0]?.originalname || '',
    };

    return this.internshipService.create(dto);
  }

  @Get()
  async findAll(): Promise<Internship[]> {
    return this.internshipService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Internship | null> {
    return this.internshipService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.internshipService.delete(id);
  }
}
