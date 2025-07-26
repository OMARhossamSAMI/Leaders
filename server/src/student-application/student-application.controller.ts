import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { StudentApplicationService } from './student-application.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('applications')
export class StudentApplicationController {
  constructor(private readonly appService: StudentApplicationService) {}

  // applications.controller.ts
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async submitApplication(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.appService.submitApplication(body, files);
  }

  @Get()
  async getAllApplications() {
    return this.appService.getAllApplications();
  }

  @Delete(':id')
  async deleteApplication(@Param('id') id: string) {
    return this.appService.deleteApplication(id);
  }

  @Patch(':id')
  async updateApplication(@Param('id') id: string, @Body() body: any) {
    return this.appService.updateApplication(id, body);
  }
  @Get(':id')
  async getApplicationById(@Param('id') id: string) {
    return this.appService.getApplicationById(id);
  }
}
