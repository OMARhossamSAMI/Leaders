import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * One email the site sent, so it can be sent again when the receiving server
 * refuses it. SendGrid never retries a refused ("blocked") email by itself:
 * on 23–24 Nov 2026 Microsoft refused SendGrid's shared servers (Spamhaus
 * listing) and three application emails to Admission@ were simply lost.
 *
 * Only the text is kept. Attachments are re-read from `uploads/` when the
 * email is sent again (and left out if a deploy has wiped them).
 */
export type MailLogStatus =
  | 'sending' // being sent right now
  | 'sent' // SendGrid accepted it
  | 'failed' // SendGrid itself refused the request (retried when `retry`)
  | 'not_delivered' // the receiving server refused it (retried when `retry`)
  | 'delivered'
  | 'gave_up';

@Schema({ timestamps: true, collection: 'maillogs' })
export class MailLog {
  /** What the email is about: application, application-parent, contact, … */
  @Prop({ type: String, required: true, index: true })
  kind: string;

  /** The record it belongs to (e.g. the application's _id). */
  @Prop({ type: String, default: null, index: true })
  refId: string | null;

  /** Send it again when it isn't delivered (true for the school's own mailboxes). */
  @Prop({ type: Boolean, default: true })
  retry: boolean;

  @Prop({ type: [String], default: [] })
  to: string[];

  @Prop({ type: Object, required: true })
  from: { email: string; name?: string };

  @Prop({ type: String, required: true })
  subject: string;

  @Prop({ type: String, required: true })
  html: string;

  /** Files to attach again on a re-send: a file name inside `uploads/`. */
  @Prop({
    type: [{ file: String, filename: String, type: { type: String } }],
    default: [],
  })
  attachmentFiles: { file: string; filename: string; type: string }[];

  @Prop({ type: String, default: 'sending', index: true })
  status: MailLogStatus;

  @Prop({
    type: [
      {
        at: Date,
        messageId: String,
        result: String,
        reason: String,
      },
    ],
    default: [],
  })
  attempts: {
    at: Date;
    messageId?: string | null;
    result: string;
    reason?: string;
  }[];

  @Prop({ type: Date, default: null, index: true })
  nextRetryAt: Date | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export type MailLogDocument = HydratedDocument<MailLog>;
export const MailLogSchema = SchemaFactory.createForClass(MailLog);
