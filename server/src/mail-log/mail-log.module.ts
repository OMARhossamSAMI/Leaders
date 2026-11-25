import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailLog, MailLogSchema } from '../Schemas/mail-log.schema';
import {
  StudentApplication,
  StudentApplicationSchema,
} from '../Schemas/studentApplication.schema';
import { SchoolMailService } from './school-mail.service';
import { SendgridEventsController } from './sendgrid-events.controller';

/** Every email to the school's mailboxes goes through SchoolMailService. */
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MailLog.name, schema: MailLogSchema },
      { name: StudentApplication.name, schema: StudentApplicationSchema },
    ]),
  ],
  providers: [SchoolMailService],
  controllers: [SendgridEventsController],
  exports: [SchoolMailService],
})
export class MailLogModule {}
