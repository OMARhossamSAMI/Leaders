import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'wa_sends' })
export class WaSend {
  @Prop({ type: Types.ObjectId, ref: 'Application', required: true, index: true })
  appId!: Types.ObjectId;

  @Prop({ required: true, index: true })
  phone!: string; // E.164, e.g. +201234567890

  @Prop({ required: true, index: true })
  template!: string; // e.g. 'assessment_confirmation'

  @Prop() slotISO?: string;       // optional: keep context
  @Prop() sentAt?: Date;          // set after we successfully send
}

export type WaSendDocument = HydratedDocument<WaSend>;
export const WaSendSchema = SchemaFactory.createForClass(WaSend);

// one-per-parent-per-template-per-application (global “only once”)
WaSendSchema.index({ appId: 1, phone: 1, template: 1 }, { unique: true });

// If you want “once per slot”, use this instead or in addition:
// WaSendSchema.index({ appId: 1, phone: 1, template: 1, slotISO: 1 }, { unique: true });
