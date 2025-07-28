import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Job extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  careerLevel: string; // Example: "Experienced (Non-Manager)"

  @Prop({ required: true })
  employmentType: string; // Example: "Full-Time"

  @Prop({ required: true })
  academicYear: string; // Example: "25/26"

  @Prop({ required: true })
  startYear: number; // Example: 2025

  @Prop({ required: true })
  endYear: number; // Example: 2026

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
