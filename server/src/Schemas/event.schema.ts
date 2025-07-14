import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: ['ACADEMIC', 'SPORTS', 'OTHER'] })
  category: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ required: true })
  location: string;
  @Prop({ default: 'off', enum: ['on', 'off'] })
  status: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
