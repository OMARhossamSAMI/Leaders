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
    }),
    MongooseModule.forRoot(
      'mongodb://Behz92:Behz9204@ac-o8nt2z7-shard-00-00.icdejxj.mongodb.net:27017,ac-o8nt2z7-shard-00-01.icdejxj.mongodb.net:27017,ac-o8nt2z7-shard-00-02.icdejxj.mongodb.net:27017/?replicaSet=atlas-12nls9-shard-0&ssl=true&authSource=admin',
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
  ],
  controllers: [AppController], // ✅ Add this line
  providers: [
    AppService,
    MailService, // ✅ Added here correctly
  ],
})
export class AppModule {}
