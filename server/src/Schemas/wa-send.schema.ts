// wa-send.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


@Schema({ timestamps: true })
export class WaSend {
  @Prop({ type: Types.ObjectId }) appId?: Types.ObjectId;
  @Prop({ type: Types.ObjectId }) apptId?: Types.ObjectId;   // <- key for idempotency
  @Prop() slotISO?: string;                                   // fallback key with appId
  @Prop() template!: string;                                  // e.g. 'assessment_confirmation' / 'admin_custom'

  // bookkeeping only (NOT part of uniqueness)
  @Prop([String]) phonesTried?: string[];
  @Prop([String]) phonesSent?: string[];
  @Prop() sentAt?: Date;
}

export const WaSendSchema = SchemaFactory.createForClass(WaSend);

// ✅ one row per appointment+template
WaSendSchema.index(
  { apptId: 1, template: 1 },
  { unique: true, partialFilterExpression: { apptId: { $exists: true } } },
);

// ✅ fallback: one row per (application + slot + template)
WaSendSchema.index(
  { appId: 1, slotISO: 1, template: 1 },
  { unique: true,
    partialFilterExpression: { appId: { $exists: true }, slotISO: { $exists: true } } }
);
