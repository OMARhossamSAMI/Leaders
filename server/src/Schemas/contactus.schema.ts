import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactUsDocument = ContactUs & Document;

@Schema({ timestamps: true })
export class ContactUs {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  role: string; // e.g., parent, student, alumni...

  @Prop()
  grade?: string; // optional

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;
  @Prop({ default: false }) // ✅ Add this line
  reviewed: boolean;
}

export const ContactUsSchema = SchemaFactory.createForClass(ContactUs);
