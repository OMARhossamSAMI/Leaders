import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StudentApplicationService } from './student-application.service';

@Controller('applications')
export class StudentApplicationController {
  constructor(private readonly appService: StudentApplicationService) {}

  // applications.controller.ts
@Post()
async create(@Body() body: Record<string, any>) {
  return this.appService.submitApplication({ data: body });
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
