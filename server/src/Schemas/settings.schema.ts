// src/settings/schemas/settings.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingsDocument = Settings & Document;

@Schema({ collection: 'settings' })
export class Settings {
  @Prop({ default: true })
  showEvents: boolean;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
