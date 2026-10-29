import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ClosedSlot extends Document {
  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  time: string;

  @Prop()
  reason?: string;

  @Prop({ default: 'admin' })
  createdBy?: string;
}

export const ClosedSlotSchema = SchemaFactory.createForClass(ClosedSlot);
