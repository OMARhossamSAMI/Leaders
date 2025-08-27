import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookTourSlotDocument = HydratedDocument<BookTourSlot>;

@Schema({ timestamps: true, collection: 'booktour_slots' })
export class BookTourSlot {
  @Prop({ type: Date, required: true, index: true })
  iso!: Date; // UTC datetime of the tour

  @Prop({ type: String })
  label?: string; // e.g., "Wed, 3 Sep • 11:00 AM"

  @Prop({ type: Boolean, default: true, index: true })
  active!: boolean;

  @Prop({ type: Number, default: 1, min: 1 })
  capacity!: number;

  @Prop({ type: Number, default: 0, min: 0 })
  bookedCount!: number;
}

export const BookTourSlotSchema = SchemaFactory.createForClass(BookTourSlot);

// Sort newest first sometimes, but we mainly sort by iso asc in queries
BookTourSlotSchema.index({ iso: 1 });
BookTourSlotSchema.index({ active: 1, iso: 1 });
