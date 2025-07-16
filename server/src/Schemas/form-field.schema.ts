import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FormFieldDocument = FormField & Document;

@Schema({ timestamps: true })
export class FormField {
  @Prop({ required: true }) field_name: string; // e.g., student_name
  @Prop({ required: true }) label: string;      // e.g., Student Name
  @Prop({ required: true }) type: string;       // text, date, select, email...
  @Prop({ default: false }) required: boolean;
  @Prop({ type: [String] }) options?: string[]; // for select/radio
}

export const FormFieldSchema = SchemaFactory.createForClass(FormField);
