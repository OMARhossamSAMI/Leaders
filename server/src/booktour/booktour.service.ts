import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule'; // ⬅️ add this
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

  // ------- CRON JOBS -------
  @Cron(CronExpression.EVERY_11_HOURS)
  async deactivatePastSlots() {
    const now = new Date();
    const res = await this.slotModel.updateMany(
      { active: true, iso: { $lt: now } },
      { $set: { active: false } },
    );
    if (res.modifiedCount) {
      // eslint-disable-next-line no-console
      console.log(`[Scheduler] Deactivated ${res.modifiedCount} past slots`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredEvents() {
    // Set threshold to "yesterday 00:00"
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const threshold = new Date(today);
    threshold.setDate(threshold.getDate() - 1); // keep 1 extra day

    // Find slots to purge (iso date strictly < threshold)
    const oldSlots = await this.slotModel.find(
      { iso: { $lt: threshold } },
      { _id: 1 },
    ).lean();

    if (!oldSlots.length) return;

    const ids = oldSlots.map(s => s._id as Types.ObjectId);

    // Delete their bookings first (avoid orphans)
    const bDel = await this.bookingModel.deleteMany({ slotId: { $in: ids } });

    // Delete the slots themselves
    const sDel = await this.slotModel.deleteMany({ _id: { $in: ids } });

    // eslint-disable-next-line no-console
    console.log(
      `[Scheduler] Deleted ${sDel.deletedCount} expired slots and ${bDel.deletedCount} related bookings`,
    );
  }

  // ------- Slots -------

  async createSlot(dto: CreateSlotDto) {
    const iso = new Date(dto.iso);
    if (Number.isNaN(+iso)) throw new BadRequestException('Invalid iso datetime');

    const doc = new this.slotModel({
      iso,
      label: dto.label,
      active: dto.active ?? true,
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


   
  async deleteBooking(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid booking id');

    // Find the booking first to know its slotId
    const booking = await this.bookingModel.findById(id).lean();
    if (!booking) throw new NotFoundException('Booking not found');

    // Delete the booking
    const delRes = await this.bookingModel.deleteOne({ _id: new Types.ObjectId(id) });
    if (delRes.deletedCount !== 1) throw new NotFoundException('Booking not found');


    await this.slotModel.updateOne(
      { _id: new Types.ObjectId(booking.slotId as any) },
      [
        {
          $set: {
            bookedCount: {
              $max: [
                { $subtract: ["$bookedCount", 1] },
                0
              ]
            }
          }
        }
      ]
    );

    return { ok: true, deleted: true };
  }


  // ------- Admin helpers -------

  async listAllBookings() {
    return this.bookingModel
      .find({})
      .sort({ createdAt: -1 })
      .populate({ path: 'slotId', select: 'iso label active' })
      .lean();
  }

  async listBookingsForSlot(slotId: string) {
    if (!Types.ObjectId.isValid(slotId)) throw new BadRequestException('Invalid slot id');

    const slot = await this.slotModel.findById(slotId).lean();
    if (!slot) throw new NotFoundException('Slot not found');

    const oid = new Types.ObjectId(slotId);
    const or: any[] = [{ slotId: oid }, { slotId: slotId }];
    if (slot.label?.trim()) or.push({ selectedLabel: slot.label.trim() });

    return this.bookingModel.find({ $or: or }).sort({ createdAt: -1 }).lean();
  }
}
