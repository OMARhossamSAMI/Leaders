import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BookTourSlot, BookTourSlotDocument } from '../Schemas/booktour-slot.schema';
import { BookTourBooking, BookTourBookingDocument } from '../Schemas/booktour-booking.schema';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookTourService {
  constructor(
    @InjectModel(BookTourSlot.name) private slotModel: Model<BookTourSlotDocument>,
    @InjectModel(BookTourBooking.name) private bookingModel: Model<BookTourBookingDocument>,
  ) {}

  // Admin
  async createSlot(dto: CreateSlotDto) {
    const iso = new Date(dto.iso);
    if (Number.isNaN(+iso)) throw new BadRequestException('Invalid iso datetime');

    const doc = new this.slotModel({
      iso,
      label: dto.label,
      active: dto.active ?? true,
      capacity: dto.capacity ?? 1,
    });
    return doc.save();
  }

  async listSlots(params?: { active?: boolean }) {
    const query: Record<string, any> = {};
    if (typeof params?.active === 'boolean') query.active = params.active;
    return this.slotModel.find(query).sort({ iso: 1 }).lean();
  }

  async updateSlot(id: string, dto: UpdateSlotDto) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid id');

    const update: Record<string, any> = {};
    if (dto.iso) {
      const d = new Date(dto.iso);
      if (Number.isNaN(+d)) throw new BadRequestException('Invalid iso datetime');
      update.iso = d;
    }
    if (typeof dto.active === 'boolean') update.active = dto.active;
    if (dto.label !== undefined) update.label = dto.label;
    if (dto.capacity !== undefined) update.capacity = dto.capacity;

    const res = await this.slotModel.findByIdAndUpdate(id, update, { new: true });
    if (!res) throw new NotFoundException('Slot not found');
    return res;
  }

  async deleteSlot(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid id');
    const res = await this.slotModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Slot not found');
    await this.bookingModel.deleteMany({ slotId: res._id });
    return { ok: true };
  }

  // Public
  async listActiveSlots() {
    const now = new Date();
    return this.slotModel
      .find({ active: true, iso: { $gte: now } })
      .sort({ iso: 1 })
      .lean();
  }

  /**
   * Capacity-safe booking:
   * - Atomically increments bookedCount only if below capacity and slot is active & in the future
   * - Then creates the booking
   */
  async createBooking(dto: CreateBookingDto) {
    if (!Types.ObjectId.isValid(dto.slotId)) throw new BadRequestException('Invalid slotId');

    const slot = await this.slotModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(dto.slotId),
        active: true,
        iso: { $gte: new Date() },
        $expr: { $lt: ['$bookedCount', '$capacity'] },
      },
      { $inc: { bookedCount: 1 } },
      { new: true },
    );

    if (!slot) {
      // Determine a clearer reason
      const exists = await this.slotModel.findById(dto.slotId);
      if (!exists) throw new NotFoundException('Slot not found');
      if (!exists.active) throw new BadRequestException('Slot is not active');
      if (exists.iso < new Date()) throw new BadRequestException('Slot has passed');
      if (exists.bookedCount >= exists.capacity) throw new BadRequestException('Slot is full');
      throw new BadRequestException('Booking not allowed');
    }

    const booking = await this.bookingModel.create({
      slotId: slot._id,
      studentName: dto.studentName,
      parentEmail: dto.parentEmail,
      parentPhone: dto.parentPhone,
      selectedLabel: dto.selectedLabel ?? slot.label,
    });

    return booking;
  }

  // Admin helper
  async listBookingsForSlot(slotId: string) {
    if (!Types.ObjectId.isValid(slotId)) throw new BadRequestException('Invalid slot id');
    return this.bookingModel.find({ slotId }).sort({ createdAt: -1 }).lean();
  }
}
