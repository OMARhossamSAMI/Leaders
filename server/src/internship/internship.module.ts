import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Internship, InternshipSchema } from '../Schemas/internship.schema';
import { InternshipController } from './internship.controller';
import { InternshipService } from './internship.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Internship.name, schema: InternshipSchema }]),
  ],
  controllers: [InternshipController],
  providers: [InternshipService],
})
export class InternshipModule {}
