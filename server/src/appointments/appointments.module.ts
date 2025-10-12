// src/appointments/appointments.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { SettingsModule } from '../settings/settings.module';
import { Appointment, AppointmentSchema } from '../Schemas/appointment.schema';
import {
  StudentApplication,
  StudentApplicationSchema,
} from '../Schemas/studentApplication.schema';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { StudentApplicationModule } from '../student-application/student-application.module';
import { AcceptedStudentModule } from '../accepted-student/accepted-student.module';
import { ClosedSlot, ClosedSlotSchema } from '../Schemas/closedSlot.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      {
        name: StudentApplication.name,
        schema: StudentApplicationSchema,
        collection: 'studentapplications',
      },
      {
        name: 'WaSend',
        schema: require('../Schemas/wa-send.schema').WaSendSchema,
      },
      { name: ClosedSlot.name, schema: ClosedSlotSchema },
    ]),
    HttpModule,
    ConfigModule,
    StudentApplicationModule,
    AcceptedStudentModule,
    SettingsModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
