import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookTourBookingDocument = HydratedDocument<BookTourBooking>;

@Schema({ timestamps: true, collection: 'booktour_bookings' })
export class BookTourBooking {
  @Prop({ type: Types.ObjectId, ref: 'BookTourSlot', required: true, index: true })
  slotId!: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  studentName!: string;

  @Prop({ type: String, required: true, lowercase: true, trim: true })
  parentEmail!: string;

  @Prop({ type: String, required: true, trim: true })
  parentPhone!: string;

  @Prop({ type: String })
  selectedLabel?: string;
}

export const BookTourBookingSchema = SchemaFactory.createForClass(BookTourBooking);

BookTourBookingSchema.index({ createdAt: -1 });
