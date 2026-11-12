import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Controller, Param, Post, Get, Delete, Body } from '@nestjs/common';
import { AcceptedStudentService } from './accepted-student.service';
import { AcceptedStudent } from '../Schemas/AcceptedStudent.schema';

@Controller('accepted-student')
export class AcceptedStudentController {
  constructor(
    private readonly acceptedStudentService: AcceptedStudentService,
  ) {}

  // POST /accepted-student/:id/accept
  @UseGuards(JwtAuthGuard)
  @Post(':id/accept')
  async acceptStudent(@Param('id') id: string): Promise<AcceptedStudent> {
    return this.acceptedStudentService.acceptStudent(id);
  }

  // GET /accepted-student
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllAccepted(): Promise<AcceptedStudent[]> {
    return this.acceptedStudentService.findAll();
  }
  // DELETE /accepted-student/:id
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteAccepted(@Param('id') id: string): Promise<AcceptedStudent> {
    return this.acceptedStudentService.deleteById(id);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/send-assessment')
  async sendAssessmentMessage(
    @Param('id') id: string,
    @Body()
    body: {
      fatherName: string;
      studentName: string;
      date: string;
      time: string;
      phoneNumber: string;
    },
  ) {
    return this.acceptedStudentService.sendAssessmentMessage(id, body);
  }
}
