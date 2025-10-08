import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BookTourService } from './booktour.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
// import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('booktour')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class BookTourController {
  constructor(private readonly svc: BookTourService) {}

  @Get('admin/ping')
  ping() {
    return { ok: true, at: new Date().toISOString() };
  }

  // ---------- Admin — slots ----------
  // @UseGuards(JwtAuthGuard)
  @Post('admin/slots')
  createSlot(@Body() dto: CreateSlotDto) {
    return this.svc.createSlot(dto);
  }

  @Get('admin/slots')
  listSlots(@Query('active') active?: string) {
    const v = typeof active === 'string' ? active.toLowerCase() : undefined;
    const parsed = v === 'true' ? true : v === 'false' ? false : undefined;
    return this.svc.listSlots({ active: parsed as any });
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('admin/slots/:id')
  updateSlot(@Param('id') id: string, @Body() dto: UpdateSlotDto) {
    return this.svc.updateSlot(id, dto);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete('admin/slots/:id')
  deleteSlot(@Param('id') id: string) {
    return this.svc.deleteSlot(id);
  }

  // ---------- Admin — bookings ----------
  // Bookings for a specific slot
  @Get('admin/slots/:id/bookings')
  listBookings(@Param('id') slotId: string) {
    return this.svc.listBookingsForSlot(slotId);
  }

  // All bookings (global)
  @Get('admin/bookings')
  listAllBookings() {
    return this.svc.listAllBookings();
  }

    @Delete('admin/bookings/:id')
  deleteBooking(@Param('id') id: string) {
    return this.svc.deleteBooking(id);
  }

  // ---------- Public ----------
  @Get('slots/active')
  listActiveSlots() {
    return this.svc.listActiveSlots();
  }

  @Post('bookings')
  createBooking(@Body() dto: CreateBookingDto) {
    return this.svc.createBooking(dto);
  }
}
