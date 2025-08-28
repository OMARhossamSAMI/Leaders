import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BookTourSlot } from './booktour-slot.schema';

export type BookTourBookingDocument = HydratedDocument<BookTourBooking>;

@Schema({ timestamps: true, collection: 'booktour_bookings' })
export class BookTourBooking {
  @Prop({ type: Types.ObjectId, ref: BookTourSlot.name, required: true, index: true })
  slotId!: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  studentName!: string;

  @Prop({ type: String, required: true, lowercase: true, trim: true })
  parentEmail!: string;

  @Prop({ type: String, required: true, trim: true })
  parentPhone!: string;

  // optional snapshot of what user saw
  @Prop({ type: String, trim: true })
  selectedLabel?: string;
}

export const BookTourBookingSchema = SchemaFactory.createForClass(BookTourBooking);
BookTourBookingSchema.index({ createdAt: -1 });
