import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookTourController } from './booktour.controller';
import { BookTourService } from './booktour.service';
import { BookTourSlot, BookTourSlotSchema } from '../Schemas/booktour-slot.schema';
import { BookTourBooking, BookTourBookingSchema } from '../Schemas/booktour-booking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BookTourSlot.name, schema: BookTourSlotSchema },
      { name: BookTourBooking.name, schema: BookTourBookingSchema },
    ]),
  ],
  controllers: [BookTourController],
  providers: [BookTourService],
  exports: [BookTourService],
})
export class BookTourModule {}
