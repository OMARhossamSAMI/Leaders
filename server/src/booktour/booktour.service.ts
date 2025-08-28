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

  // ------- Slots -------

  async createSlot(dto: CreateSlotDto) {
    const iso = new Date(dto.iso);
    if (Number.isNaN(+iso)) throw new BadRequestException('Invalid iso datetime');

    const doc = new this.slotModel({
      iso,
      label: dto.label,
      active: dto.active ?? true,
      // capacity removed
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
    // capacity removed

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

  // ------- Booking -------

  /**
   * Unlimited-capacity booking:
   * - Ensure slot exists, is active, and in the future
   * - Atomically increments bookedCount
   * - Creates the booking
   */
  async createBooking(dto: CreateBookingDto) {
    if (!Types.ObjectId.isValid(dto.slotId)) throw new BadRequestException('Invalid slotId');

    const slot = await this.slotModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(dto.slotId),
        active: true,
        iso: { $gte: new Date() },
      },
      { $inc: { bookedCount: 1 } },
      { new: true },
    );

    if (!slot) {
      const exists = await this.slotModel.findById(dto.slotId);
      if (!exists) throw new NotFoundException('Slot not found');
      if (!exists.active) throw new BadRequestException('Slot is not active');
      if (exists.iso < new Date()) throw new BadRequestException('Slot has passed');
      // capacity checks removed
      throw new BadRequestException('Booking not allowed');
    }

    return this.bookingModel.create({
      slotId: slot._id,
      studentName: dto.studentName,
      parentEmail: dto.parentEmail,
      parentPhone: dto.parentPhone,
      selectedLabel: dto.selectedLabel ?? slot.label,
    });
  }

  // ------- Admin helpers -------

  async listAllBookings() {
    return this.bookingModel
      .find({})
      .sort({ createdAt: -1 })
      .populate({ path: 'slotId', select: 'iso label active' }) // removed capacity
      .lean();
  }

  async listBookingsForSlot(slotId: string) {
    if (!Types.ObjectId.isValid(slotId)) throw new BadRequestException('Invalid slot id');

    const slot = await this.slotModel.findById(slotId).lean();
    if (!slot) throw new NotFoundException('Slot not found');

    const oid = new Types.ObjectId(slotId);

    // Primary: exact ObjectId match
    // Safeties: legacy string match OR label match if your old data only stored labels
    const or: any[] = [{ slotId: oid }, { slotId: slotId }];
    if (slot.label?.trim()) or.push({ selectedLabel: slot.label.trim() });

    return this.bookingModel.find({ $or: or }).sort({ createdAt: -1 }).lean();
  }
}
