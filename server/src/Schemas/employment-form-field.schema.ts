// employment-form-field.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmploymentFormFieldDocument = EmploymentFormField & Document;

@Schema()
export class EmploymentFormField {
  @Prop({ required: true })
  field_name: string;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  type: string;

  @Prop({ default: false })
  required: boolean;

  @Prop({ type: [String], default: [] })
  options?: string[];

  @Prop({ default: 0 })
  order: number;
}

export const EmploymentFormFieldSchema = SchemaFactory.createForClass(EmploymentFormField);
