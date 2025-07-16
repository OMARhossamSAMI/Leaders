import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormField, FormFieldSchema } from '../Schemas/form-field.schema';
import { FormFieldService } from './form-field.service';
import { FormFieldController } from './form-field.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: FormField.name, schema: FormFieldSchema }])],
  providers: [FormFieldService],
  controllers: [FormFieldController],
})
export class FormFieldModule {}
