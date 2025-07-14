// src/testimonials/schemas/testimonials.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TestimonialDocument = Testimonial & Document;

@Schema({ timestamps: { createdAt: 'dateCreated', updatedAt: false } })
export class Testimonial {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  profilePhoto: string;

  @Prop()
  dateCreated: Date;

  @Prop({ default: false })
  on: boolean;

  @Prop({ default: false })
  off: boolean;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
