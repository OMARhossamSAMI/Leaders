import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudentApplicationDocument = StudentApplication & Document;

@Schema({ timestamps: true })
export class StudentApplication {
  @Prop({ type: Object }) 
  data: Record<string, any>; // All submitted form fields

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

export const StudentApplicationSchema = SchemaFactory.createForClass(StudentApplication);
