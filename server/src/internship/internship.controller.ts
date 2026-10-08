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
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { InternshipService } from './internship.service';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { Internship } from '../Schemas/internship.schema';
import { Response } from 'express';
import { Workbook } from 'exceljs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

// ✅ Ensure uploads folder exists
const uploadPath = './uploads';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

@Controller('internship')
export class InternshipController {
  constructor(private readonly internshipService: InternshipService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cv_file', maxCount: 1 },
        { name: 'cover_letter', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${uuidv4()}${extname(file.originalname)}`;
            cb(null, uniqueName);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (file.mimetype !== 'application/pdf') {
            return cb(
              new BadRequestException('Only PDF files are allowed'),
              false,
            );
          }
          cb(null, true);
        },
      },
    ),
  )
  async create(
    @UploadedFiles()
    files: {
      cv_file?: Express.Multer.File[];
      cover_letter?: Express.Multer.File[];
    },
    @Body() body: CreateInternshipDto,
  ): Promise<Internship> {
    const dto: CreateInternshipDto = {
      ...body,
      cv_file_url: files.cv_file?.[0]
        ? `/uploads/${files.cv_file[0].filename}`
        : '',
      cover_letter_url: files.cover_letter?.[0]
        ? `/uploads/${files.cover_letter[0].filename}`
        : '',
    };

    return this.internshipService.create(dto);
  }

  @Get('export')
async exportToExcel(@Res() res: Response) {
  const hostUrl = 'http://localhost:3000'; // Replace with your actual host in production

  const applications = (await this.internshipService.findAll()).map(app => ({
    full_name: app.full_name,
    email: app.email,
    phone: app.phone,
    university: app.university,
    degree: app.degree,
    year_of_study: app.year_of_study,
    start_date: app.start_date,
    duration: app.duration,
    desired_position: app.desired_position,
    motivation: app.motivation,
    cv_file_url: app.cv_file_url ? `${hostUrl}${app.cv_file_url}` : '',
    cover_letter_url: app.cover_letter_url ? `${hostUrl}${app.cover_letter_url}` : '',
    createdAt: app.createdAt,
  }));

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Internship Applications');

  worksheet.columns = [
    { header: 'Full Name', key: 'full_name', width: 25 },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'University', key: 'university', width: 25 },
    { header: 'Degree', key: 'degree', width: 20 },
    { header: 'Year', key: 'year_of_study', width: 10 },
    { header: 'Start Date', key: 'start_date', width: 15 },
    { header: 'Duration', key: 'duration', width: 15 },
    { header: 'Desired Position', key: 'desired_position', width: 20 },
    { header: 'Motivation', key: 'motivation', width: 30 },
    { header: 'CV URL', key: 'cv_file_url', width: 30 },
    { header: 'Cover Letter URL', key: 'cover_letter_url', width: 30 },
    { header: 'Submitted At', key: 'createdAt', width: 20 },
  ];

  applications.forEach((app) => {
    const row = worksheet.addRow(app);

    if (app.cv_file_url) {
      row.getCell('cv_file_url').value = {
        text: 'View CV',
        hyperlink: app.cv_file_url,
      };
    }

    if (app.cover_letter_url) {
      row.getCell('cover_letter_url').value = {
        text: 'View Cover Letter',
        hyperlink: app.cover_letter_url,
      };
    }
  });

  worksheet.getColumn('start_date').numFmt = 'yyyy-mm-dd';
  worksheet.getColumn('createdAt').numFmt = 'yyyy-mm-dd hh:mm';

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=internship-applications.xlsx',
  );

  await workbook.xlsx.write(res);
  res.end();
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
