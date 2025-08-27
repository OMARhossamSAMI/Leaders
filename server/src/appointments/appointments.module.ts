// appointments.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

import { Appointment, AppointmentSchema } from '../Schemas/appointment.schema';
import {
  StudentApplication,
  StudentApplicationSchema,
} from '../Schemas/studentApplication.schema'; // <-- correct path & model
import { HttpModule } from '@nestjs/axios'; // 👈 import HttpModule
import { ConfigModule } from '@nestjs/config';
import { StudentApplicationModule } from '../student-application/student-application.module'; // 👈 add this
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      // Bind the student applications collection explicitly
      {
        name: StudentApplication.name,
        schema: StudentApplicationSchema,
        collection: 'studentapplications',
      },
    ]),
    HttpModule, // 👈 add this
    ConfigModule, // 👈 make sure ConfigModule is available
    StudentApplicationModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
