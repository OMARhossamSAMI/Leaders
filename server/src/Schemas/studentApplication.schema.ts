import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudentApplicationDocument = StudentApplication & Document;

export type ApplicationState =
  | 'applied'
  | 'waiting_for_assessment'
  | 'assessed'
  | 'accepted'
  | 'rejected';

@Schema({ timestamps: true })
export class StudentApplication {
  // dynamic form payload
  @Prop({ type: Object })
  data: Record<string, any>;

  // NEW: static status field
  @Prop({
    type: String,
    enum: [
      'applied',
      'waiting_for_assessment',
      'assessed',
      'accepted',
      'rejected',
    ],
    default: 'applied',
    index: true,
  })
  state: ApplicationState;
  // ✅ new field
  @Prop({ type: Boolean, default: false })
  hasBookedAppointment: boolean;
  // ✅ Apointment code for booking
  @Prop({ type: String, unique: true, required: true })
  appointmentCode: string;

  createdAt?: Date;
  updatedAt?: Date;

  @Prop({
    type: [
      {
        originalname: { type: String },
        path: { type: String },
      },
    ],
    default: [],
  })
  files?: { originalname: string; path: string }[];

  /**
   * Emails about this application that weren't delivered, shown in the admin:
   * `admissions` = the email to Admission@ (sent again automatically),
   * `parent` = the parent's confirmation with the booking code (the address
   * is usually mistyped, so the school should call the parent).
   */
  @Prop({
    type: [
      {
        kind: { type: String },
        to: { type: String },
        reason: { type: String },
        at: { type: Date },
        resolved: { type: Boolean, default: false },
        retrying: { type: Boolean, default: false },
      },
    ],
    default: undefined,
  })
  emailIssues?: {
    kind: 'admissions' | 'parent';
    to: string;
    reason: string;
    at: Date;
    resolved: boolean;
    retrying: boolean;
  }[];
}

export const StudentApplicationSchema =
  SchemaFactory.createForClass(StudentApplication);
