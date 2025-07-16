import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudentApplicationDocument = StudentApplication & Document;

@Schema({ timestamps: true })
export class StudentApplication {
  @Prop({ type: Object }) data: Record<string, any>; // all submitted form fields
}

export const StudentApplicationSchema = SchemaFactory.createForClass(StudentApplication);

