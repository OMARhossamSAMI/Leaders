import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EmploymentFormField,
  EmploymentFormFieldSchema,
} from '../Schemas/employment-form-field.schema';
import { EmploymentFormFieldsService } from './employment-form-fields.service';
import { EmploymentFormFieldsController } from './employment-form-fields.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmploymentFormField.name, schema: EmploymentFormFieldSchema },
    ]),
  ],
  controllers: [EmploymentFormFieldsController],
  providers: [EmploymentFormFieldsService],
})
export class EmploymentFormFieldsModule {}
