import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { EventsModule } from './events/events.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SettingsModule } from './settings/settings.module';
import { StudentApplicationModule } from './student-application/student-application.module';
import { FormFieldModule } from './form-field/form-field.module';
import { PopupModule } from './popup/popup.module';
import { ContactUsModule } from './contactus/contactus.module';
import { EmploymentFormFieldsModule } from './employment-form-fields/employment-form-fields.module';
import { VacancyModule } from './vacancy/vacancy.module';
import { JobModule } from './job/job.module';
import { InternshipModule } from './internship/internship.module';
import { AuthModule } from './auth/auth.module';
import { MailService } from './mail/mail.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AcceptedStudentModule } from './accepted-student/accepted-student.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { BookTourModule } from './booktour/booktour.module';
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '..', 'uploads'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'], // load local first, then .env
    }),
    MongooseModule.forRoot(
      'mongodb://youssefsahhar2406_db_user:MiVXMDHQ2jwp7ntN@ac-zxmohbk-shard-00-00.3zvekkv.mongodb.net:27017/?replicaSet=atlas-q52x6y-shard-0&ssl=true&authSource=admin',
    ),
    ScheduleModule.forRoot(),
    TestimonialsModule,
    EventsModule,
    SettingsModule,
    StudentApplicationModule,
    FormFieldModule,
    PopupModule,
    ContactUsModule,
    EmploymentFormFieldsModule,
    VacancyModule,
    JobModule,
    InternshipModule,
    AuthModule,
    AcceptedStudentModule,
    AppointmentsModule,
    WhatsappModule,
    BookTourModule,
  ],
  controllers: [AppController], // ✅ Add this line
  providers: [
    AppService,
    MailService, // ✅ Added here correctly
  ],
})
export class AppModule {}
