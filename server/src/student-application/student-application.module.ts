import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentApplication, StudentApplicationSchema } from '../Schemas/studentApplication.schema';
import { StudentApplicationService } from './student-application.service';
import { StudentApplicationController } from './student-application.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentApplication.name, schema: StudentApplicationSchema },
    ]),
  ],
  providers: [StudentApplicationService],
  controllers: [StudentApplicationController],
})
export class StudentApplicationModule {}
