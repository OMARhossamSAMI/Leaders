import { Controller, Param, Post, Get } from '@nestjs/common';
import { AcceptedStudentService } from './accepted-student.service';
import { AcceptedStudent } from '../Schemas/AcceptedStudent.schema';

@Controller('accepted-student')
export class AcceptedStudentController {
  constructor(
    private readonly acceptedStudentService: AcceptedStudentService,
  ) {}

  // POST /accepted-student/:id/accept
  @Post(':id/accept')
  async acceptStudent(@Param('id') id: string): Promise<AcceptedStudent> {
    return this.acceptedStudentService.acceptStudent(id);
  }

  // GET /accepted-student
  @Get()
  async getAllAccepted(): Promise<AcceptedStudent[]> {
    return this.acceptedStudentService.findAll();
  }
}
