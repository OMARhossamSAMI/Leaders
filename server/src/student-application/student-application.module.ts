import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StudentApplication,
  StudentApplicationSchema,
} from '../Schemas/studentApplication.schema';
import { StudentApplicationService } from './student-application.service';
import { StudentApplicationController } from './student-application.controller';

import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentApplication.name, schema: StudentApplicationSchema },
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
        },
      }),
    }),
  ],
  providers: [StudentApplicationService],
  controllers: [StudentApplicationController],
  exports: [StudentApplicationService], // 👈 THIS lets other modules use it
})
export class StudentApplicationModule {}
