import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InternshipDocument = Internship & Document;

@Schema({ timestamps: true })
export class Internship {
  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  university: string;

  @Prop({ required: true })
  degree: string;

  @Prop({ required: true })
  year_of_study: number;

  @Prop({ required: true })
  start_date: Date;

  @Prop({ required: true })
  duration: string;

  @Prop()
  motivation: string;

  @Prop()
  cv_file_url: string;

  @Prop()
  cover_letter_url: string;
}

export const InternshipSchema = SchemaFactory.createForClass(Internship);
