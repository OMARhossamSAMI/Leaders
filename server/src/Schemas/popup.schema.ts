import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PopupDocument = Popup & Document;

@Schema({ timestamps: true })
export class Popup {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: [String], default: [] })
  paths: string[];

  @Prop({ enum: ['on', 'off'], default: 'off' })
  status: string;
  @Prop({
    type: [String],
    default: [],
    validate: [(val) => val.length <= 3, 'Maximum 3 buttons allowed'],
  })
  buttons: string[];
}

export const PopupSchema = SchemaFactory.createForClass(Popup);
