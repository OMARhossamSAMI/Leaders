import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VacancyController } from './vacancy.controller';
import { VacancyService } from './vacancy.service';
import { Vacancy, VacancySchema } from '../Schemas/vacancy.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Vacancy', schema: VacancySchema }])
  ],
  controllers: [VacancyController],
  providers: [VacancyService],
})
export class VacancyModule {}
