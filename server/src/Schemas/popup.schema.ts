import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PopupDocument = Popup & Document;

@Schema({ timestamps: true })
export class Popup {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  category: string;

  @Prop({ required: false })
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
  @Prop({ required: false })
  imagePath?: string;
}

export const PopupSchema = SchemaFactory.createForClass(Popup);
