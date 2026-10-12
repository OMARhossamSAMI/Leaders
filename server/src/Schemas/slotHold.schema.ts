import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * A slot held for one child while their parent pays (one per child).
 * Queries ignore holds whose expiresAt has passed; Mongo removes them an hour later.
 */
@Schema({ timestamps: true, collection: 'slotholds' })
export class SlotHold {
  @Prop({ type: String, required: true, unique: true })
  appointmentCode: string;

  @Prop({ type: String, required: true })
  applicationId: string;

  @Prop({ type: String, required: true })
  slotISO: string;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: String, default: null })
  checkoutUrl: string | null;
}

export type SlotHoldDocument = HydratedDocument<SlotHold>;
export const SlotHoldSchema = SchemaFactory.createForClass(SlotHold);
SlotHoldSchema.index({ slotISO: 1, expiresAt: 1 });
SlotHoldSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });

/**
 * One tiny document per slot, written at the start of every booking or hold
 * transaction so two parents can't take the last place at the same moment.
 */
@Schema({ collection: 'slotlocks', versionKey: false })
export class SlotLock {
  @Prop({ type: String })
  _id: string;

  @Prop({ type: Number, default: 0 })
  v: number;
}

export const SlotLockSchema = SchemaFactory.createForClass(SlotLock);

/** A payment that went through but couldn't be booked or confirmed, for admissions to follow up. */
@Schema({ timestamps: true, collection: 'paymentissues' })
export class PaymentIssue {
  @Prop({ type: String, required: true })
  kind: 'paid-not-booked' | 'unconfirmed' | 'paid-no-details';

  @Prop({ type: String, default: null })
  orderId: string | null;

  @Prop({ type: String, default: null })
  appointmentCode: string | null;

  @Prop({ type: String, default: null })
  slotISO: string | null;

  @Prop({ type: String, default: '' })
  reason: string;
}

export const PaymentIssueSchema = SchemaFactory.createForClass(PaymentIssue);
