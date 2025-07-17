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

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
