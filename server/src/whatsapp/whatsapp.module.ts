// whatsapp.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import {  StudentApplicationSchema } from '../Schemas/studentApplication.schema';
import { WaSend, WaSendSchema } from 'src/Schemas/wa-send.schema';
import { AppointmentSchema } from 'src/Schemas/appointment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Application',                 // ← token used by @InjectModel('Application')
        schema: StudentApplicationSchema,
        collection: 'studentapplications',          // ← ensure it’s the same physical collection
      },
      { name: WaSend.name, schema: WaSendSchema },
       { name: 'Appointment', schema: AppointmentSchema }, // <-- add this
    ]),
  ],
  controllers: [WhatsappController],
  providers: [WhatsappService],
})
export class WhatsappModule {}
