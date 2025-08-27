import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AcceptedStudent,
  AcceptedStudentSchema,
} from '../Schemas/AcceptedStudent.schema';
import {
  StudentApplication,
  StudentApplicationSchema,
} from '../Schemas/studentApplication.schema';
import { AcceptedStudentService } from './accepted-student.service';
import { AcceptedStudentController } from './accepted-student.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AcceptedStudent.name, schema: AcceptedStudentSchema },
      { name: StudentApplication.name, schema: StudentApplicationSchema },
    ]),
  ],
  controllers: [AcceptedStudentController],
  providers: [AcceptedStudentService],
  exports: [AcceptedStudentService], // 👈 allow other modules to inject it
})
export class AcceptedStudentModule {}
