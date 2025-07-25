import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactUsService } from './contactus.service';
import { ContactUsController } from './contactus.controller';
import { ContactUs, ContactUsSchema } from '../Schemas/contactus.schema';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContactUs.name, schema: ContactUsSchema },
    ]),
  ],
  controllers: [ContactUsController],
  providers: [ContactUsService, MailService],
})
export class ContactUsModule {}
