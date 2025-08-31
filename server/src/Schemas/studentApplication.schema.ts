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
}

export const StudentApplicationSchema =
  SchemaFactory.createForClass(StudentApplication);
