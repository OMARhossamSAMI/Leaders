import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as sgMail from '@sendgrid/mail';
import {
  BookTourSlot,
  BookTourSlotDocument,
} from '../Schemas/booktour-slot.schema';
import {
  BookTourBooking,
  BookTourBookingDocument,
} from '../Schemas/booktour-booking.schema';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { CreateBookingDto } from './dto/create-booking.dto';

// ✅ Log & set SendGrid (like student application service)
console.log('SENDGRID API KEY (partial):', process.env.SENDGRID_API_KEY?.slice(0, 10) || 'Not found');
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Small helpers
function fmtDate(dt: Date) {
  // pretty label (e.g., "Mon, Sep 1, 2025 – 11:00")
  return `${dt.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })} – ${dt.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

@Injectable()
export class BookTourService {
  constructor(
    @InjectModel(BookTourSlot.name) private slotModel: Model<BookTourSlotDocument>,
    @InjectModel(BookTourBooking.name) private bookingModel: Model<BookTourBookingDocument>,
  ) {}

  // ------- CRON JOBS -------

  // Deactivate passed slots periodically
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

  // Nightly cleanup: delete expired slots (older than "yesterday 00:00") and their bookings
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredEvents() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const threshold = new Date(today);
    threshold.setDate(threshold.getDate() - 1); // keep 1 extra day

    const oldSlots = await this.slotModel.find(
      { iso: { $lt: threshold } },
      { _id: 1 },
    ).lean();

    if (!oldSlots.length) return;

    const ids = oldSlots.map((s) => s._id as Types.ObjectId);

    const bDel = await this.bookingModel.deleteMany({ slotId: { $in: ids } });
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

  /**
   * Create a booking, increment bookedCount, then email:
   *  - Admissions: summary of booking
   *  - Parent: confirmation & details
   */
  async createBooking(dto: CreateBookingDto) {
    if (!Types.ObjectId.isValid(dto.slotId)) throw new BadRequestException('Invalid slotId');

    // Atomically increment bookedCount on an active, future slot
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

    // Create booking doc
    const booking = await this.bookingModel.create({
      slotId: slot._id,
      studentName: dto.studentName,
      parentEmail: dto.parentEmail,
      parentPhone: dto.parentPhone,
      selectedLabel: dto.selectedLabel ?? slot.label,
    });

    // --- EMAILS (mirroring your student app approach) ---
    const admissionsTo = 'Admission@leadersintcollege.com';
    const fromIdentity = {
      email: 'Admission@leadersintcollege.com',
      name: 'Book a Tour',
    };

    const slotTime = new Date(slot.iso);
    const prettyTime = fmtDate(slotTime);
    const bookingCode = String(booking._id);
    const parentEmail = dto.parentEmail?.trim();

    // Admissions email (HTML summary)
    const admissionsHtml = `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 30px; max-width: 750px; margin: auto; border-radius: 8px; border: 1px solid #d3d3d3;">
  <h2 style="background-color: #004080; color: white; padding: 16px; text-align: center; border-radius: 6px;">
    🗓️ New Campus Tour Booking
  </h2>
  <p style="font-size: 15px;">A new booking has been made via the website.</p>
  <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; background-color: #fff; margin-top: 20px;">
    <thead style="background-color: #e8eef5;">
      <tr><th>Field</th><th>Value</th></tr>
    </thead>
    <tbody>
      <tr><td style="padding:8px; font-weight:bold;">Student Name</td><td style="padding:8px;">${dto.studentName || ''}</td></tr>
      <tr><td style="padding:8px; font-weight:bold;">Parent Email</td><td style="padding:8px;">${parentEmail || ''}</td></tr>
      <tr><td style="padding:8px; font-weight:bold;">Parent Phone</td><td style="padding:8px;">${dto.parentPhone || ''}</td></tr>
      <tr><td style="padding:8px; font-weight:bold;">Slot Label</td><td style="padding:8px;">${booking.selectedLabel || slot.label || ''}</td></tr>
    </tbody>
  </table>
  <p style="margin-top: 30px; font-size: 13px; color: #888;">This message was generated by the Leaders International College tour booking portal.</p>
</div>`.trim();

    const admissionsEmail = {
      to: admissionsTo,
      from: fromIdentity,
      subject: `🗓️ New Tour Booking – ${dto.studentName || 'Student'} (${prettyTime})`,
      html: admissionsHtml,
    };

    // Parent confirmation email (if email provided)
    const parentHtml = `
<div style="font-family: Arial, sans-serif; background-color: #f7fafd; padding: 30px; max-width: 700px; margin: auto; border-radius: 8px; border: 1px solid #ccddee;">
  <h2 style="background-color: #007bff; color: white; padding: 16px; text-align: center; border-radius: 6px;">
    Tour Booking Confirmed
  </h2>
  <p style="font-size: 15px;">Dear Parent of <strong>${dto.studentName || 'Student'}</strong>,</p>
  <p style="font-size: 15px;">Thank you for booking a campus tour with Leaders International College.</p>

  <p style="font-size: 15px; margin-top: 16px;">
    Slot: ${booking.selectedLabel || slot.label || '—'}
  </p>

  <p style="font-size: 15px;">We look forward to seeing you on campus.</p>
  <p style="margin-top: 30px;">Warm regards,<br/><strong>Leaders International College – Admissions Department</strong></p>
</div>
`.trim();

    const parentEmailMsg = parentEmail
      ? {
          to: parentEmail,
          from: {
            email: 'Admission@leadersintcollege.com',
            name: 'Leaders International College',
          },
          subject: `✅ Tour Booking Confirmed – ${prettyTime}`,
          html: parentHtml,
        }
      : null;

    try {
      const tasks: Promise<any>[] = [sgMail.send(admissionsEmail)];
      if (parentEmailMsg) tasks.push(sgMail.send(parentEmailMsg));
      await Promise.all(tasks);
    } catch (err: any) {
      console.error('❌ SendGrid Email Error (BookTour):', err?.response?.body || err?.message || err);
      // We mimic the student app behavior: booking saved but emails failed.
      throw new Error('Booking saved, but failed to send confirmation email(s).');
    }

    return {
      ok: true,
      bookingId: bookingCode,
    };
  }

  /**
   * Delete a booking by id.
   * - Validates ObjectId
   * - Removes the booking
   * - Safely decrements the parent slot's bookedCount (never below 0)
   */
  async deleteBooking(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid booking id');

    // Find the booking first to know its slotId
    const booking = await this.bookingModel.findById(id).lean();
    if (!booking) throw new NotFoundException('Booking not found');

    // Delete the booking
    const delRes = await this.bookingModel.deleteOne({ _id: new Types.ObjectId(id) });
    if (delRes.deletedCount !== 1) throw new NotFoundException('Booking not found');

    // Safely decrement bookedCount on the slot (never below 0)
    await this.slotModel.updateOne(
      { _id: new Types.ObjectId(booking.slotId as any) },
      [
        {
          $set: {
            bookedCount: {
              $max: [{ $subtract: ['$bookedCount', 1] }, 0],
            },
          },
        },
      ],
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
