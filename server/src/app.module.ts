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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes config available everywhere
    }),
    MongooseModule.forRoot(
      'mongodb://Behz92:Behz9204@ac-o8nt2z7-shard-00-00.icdejxj.mongodb.net:27017,ac-o8nt2z7-shard-00-01.icdejxj.mongodb.net:27017,ac-o8nt2z7-shard-00-02.icdejxj.mongodb.net:27017/?replicaSet=atlas-12nls9-shard-0&ssl=true&authSource=admin',
    ), // or MongoDB Atlas URI
    ScheduleModule.forRoot(), // ✅ Add this line to enable cron jobs
    TestimonialsModule,
    EventsModule,
    SettingsModule,
    StudentApplicationModule,
    FormFieldModule,
    PopupModule,
  ],
})
export class AppModule {}
