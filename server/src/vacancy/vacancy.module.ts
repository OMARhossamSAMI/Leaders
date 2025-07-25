import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VacancyController } from './vacancy.controller';
import { VacancyService } from './vacancy.service';
import { Vacancy, VacancySchema } from '../Schemas/vacancy.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FormFieldService } from 'src/form-field/form-field.service';
import { FormFieldSchema } from 'src/Schemas/form-field.schema';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
    MongooseModule.forFeature([{ name: 'Vacancy', schema: VacancySchema }]),
    MongooseModule.forFeature([{ name: 'FormField', schema: FormFieldSchema }]), // Adjust the schema import as needed
  ],
  controllers: [VacancyController],
  providers: [VacancyService,FormFieldService],
})
export class VacancyModule {}
