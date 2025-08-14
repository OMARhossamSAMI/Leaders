// accepted-student.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AcceptedStudentDocument = AcceptedStudent & Document;

@Schema({ timestamps: true })
export class AcceptedStudent {
  @Prop({ type: Object, required: true })
  data: Record<string, any>; // All form fields (same as StudentApplication)

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

  createdAt?: Date;
  updatedAt?: Date;
}

export const AcceptedStudentSchema =
  SchemaFactory.createForClass(AcceptedStudent);
