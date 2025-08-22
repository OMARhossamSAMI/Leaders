import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Appointment,
  AppointmentDocument,
} from '../Schemas/appointment.schema';
import {
  StudentApplication,
  StudentApplicationDocument,
} from '../Schemas/studentApplication.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

// Opening window: 09:00–12:15 every 15 min
const START_HOUR = 9;
const END_HOUR = 12;
const LAST_MIN = 15;


@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly apptModel: Model<AppointmentDocument>,

    // ✅ inject the REAL student applications model/collection
    @InjectModel(StudentApplication.name)
    private readonly appModel: Model<StudentApplicationDocument>,
  ) {}


  private escape(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async create(dto: CreateAppointmentDto) {
    const { applicationId, parentEmail, slotISO } = dto;

    // --- validate & canonicalize slot ---
    if (!slotISO) {
      throw new BadRequestException('slotISO is required');
    }
    const slot = new Date(slotISO);
    if (isNaN(slot.getTime())) {
      throw new BadRequestException('Invalid slot date/time');
    }
    const slotUtcISO = slot.toISOString();

    // === DEBUG
    console.log('[Appointments] payload:', {
      applicationId,
      parentEmail,
      slotISO,
    });
    console.log(
      '[Appointments] appModel collection =',
      this.appModel.collection.name,
    );

    // ---- find application (by id, then by parent email) ----
    let application: any = null;

    if (applicationId && Types.ObjectId.isValid(applicationId)) {
      console.log('[Appointments] try findById:', applicationId);
      application = await this.appModel.findById(applicationId).lean();
      console.log('[Appointments] byId found?', !!application);
    } else {
      console.log(
        '[Appointments] applicationId missing or invalid:',
        applicationId,
      );
    }

    if (!application && parentEmail) {
      const email = parentEmail.trim();
      const query = {
        $or: [
          {
            'data.father_email': {
              $regex: `^${this.escape(email)}$`,
              $options: 'i',
            },
          },
          {
            'data.mother_email': {
              $regex: `^${this.escape(email)}$`,
              $options: 'i',
            },
          },
        ],
      };
      console.log(
        '[Appointments] try findOne by email with query:',
        JSON.stringify(query),
      );
      application = await this.appModel.findOne(query).lean();
      console.log(
        '[Appointments] byEmail found?',
        !!application,
        'email=',
        email,
      );
      if (application)
        console.log('[Appointments] found _id:', application._id?.toString());
    }

    if (!application) {
      console.log(
        '[Appointments] NOT FOUND. Check id/email/collection imports.',
      );
      throw new BadRequestException('Application not found');
    }

    // ---- Business rules ----
    // 1) No Fri/Sat
    const dow = slot.getDay(); // 0=Sun, 5=Fri, 6=Sat
    if (dow === 5 || dow === 6) {
      throw new BadRequestException(
        'Appointments are not available on Friday or Saturday',
      );
    }

    // 2) Only within two weeks from application "createdAt" (or today if missing)
    const submitted = application.createdAt
      ? new Date(application.createdAt)
      : new Date();
    const winStart = new Date(
      submitted.getFullYear(),
      submitted.getMonth(),
      submitted.getDate(),
    );
    const winEnd = new Date(winStart);
    winEnd.setDate(winEnd.getDate() + 14);

    if (slot < winStart || slot > winEnd) {
      throw new BadRequestException(
        'Selected slot is outside the allowed scheduling window',
      );
    }

    // 3) 09:00–12:30 window, 15-minute increments (last selectable 12:15)
    const hh = slot.getHours();
    const mm = slot.getMinutes();
    if (mm % 15 !== 0) {
      throw new BadRequestException('Slots must align to 15-minute intervals');
    }
    const inRange = hh === 9 || (hh > 9 && hh < 12) || (hh === 12 && mm <= 15);
    if (!inRange) {
      throw new BadRequestException('Slots must be between 09:00 and 12:30');
    }

    // 4) Prevent double booking of the exact slot (compare canonical ISO)
    const already = await this.apptModel
      .findOne({ slotISO: slotUtcISO })
      .lean();
    if (already) {
      throw new BadRequestException('This slot has already been booked');
    }

    // ---- Create appointment ----
    const doc = await this.apptModel.create({
      applicationId: application._id as Types.ObjectId,
      parentEmail,
      slotISO: slotUtcISO,
    });

    // mark the application as waiting for assessment
    await this.appModel.updateOne(
      { _id: application._id, state: { $ne: 'waiting_for_assessment' } },
      { $set: { state: 'waiting_for_assessment' } },
    );

    return {
      _id: doc.id, // string getter
      applicationId: (application._id as Types.ObjectId).toString(),
      slotISO: doc.slotISO,
    };
  }

  private escapeRegex(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  async listAll(opts?: { upcoming?: boolean; q?: string }) {
    const filter: any = {};
    if (opts?.upcoming) {
      filter.slotISO = { $gte: new Date().toISOString() };
    }
    if (opts?.q) {
      // case-insensitive contains on parentEmail
      filter.parentEmail = { $regex: this.escapeRegex(opts.q), $options: 'i' };
    }

    const docs = await this.apptModel
      .find(filter)
      .sort({ slotISO: 1 })
      .lean()
      .exec();

    // normalize shape
    return docs.map((d) => ({
      _id: String(d._id),
      parentEmail: d.parentEmail,
      slotISO: d.slotISO,
      applicationId: d.applicationId ? String(d.applicationId) : undefined,
      createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : undefined,
    }));
  }

  /** Generate all 15-min slots 09:00..12:15 (local) as HH:mm */
  private generateSlots(): string[] {
    const times: string[] = [];
    let h = 9, m = 0;
    while (h < 12 || (h === 12 && m <= 15)) {
      times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      m += 15;
      if (m === 60) { m = 0; h += 1; }
    }
    return times;
  }

  /** From a local YYYY-MM-DD + JS offset (UTC - local), compute UTC start/end ISO range for that local day. */
  private utcRangeFromLocalYmd(dateISO: string, offsetMin: number) {
    const [y, m, d] = dateISO.split('-').map(Number);
    // IMPORTANT: add offset (not subtract). offset = UTC - local
    const startUtcMs = Date.UTC(y, m - 1, d, 0, 0, 0, 0) + offsetMin * 60_000;
    const endUtcMs   = Date.UTC(y, m - 1, d, 23, 59, 59, 999) + offsetMin * 60_000;
    return {
      startISO: new Date(startUtcMs).toISOString(),
      endISO: new Date(endUtcMs).toISOString(),
    };
  }

  /** Convert a stored UTC ISO into local HH:mm using JS offset (UTC - local). */
  private utcIsoToLocalHHmm(utcISO: string, offsetMin: number): string {
    const utc = new Date(utcISO);
    // local = UTC - offset
    const localMs = utc.getTime() - offsetMin * 60_000;
    const local = new Date(localMs);
    return local.toISOString().substring(11, 16); // HH:mm
    // (safe because we constructed from exact ms; substring uses the UTC-form of the adjusted local Date)
  }

  /** Return only available HH:mm strings for the given local day. */
  async availableTimesForDate(dateISO: string, offsetMin: number) {
    const { startISO, endISO } = this.utcRangeFromLocalYmd(dateISO, offsetMin);

    // Fetch all appointments whose UTC slot falls within that local day
    const docs = await this.apptModel
      .find({ slotISO: { $gte: startISO, $lte: endISO } })
      .lean();

    const takenSet = new Set(
      docs.map((a) => this.utcIsoToLocalHHmm(a.slotISO as unknown as string, offsetMin)),
    );

    const all = this.generateSlots();
    const available = all.filter((t) => !takenSet.has(t));
    return { times: available };
  }

  // (Optional) If you still use a "taken times" endpoint elsewhere, fix it the same way:
  async getTakenTimesForDate(dateISO: string, offsetMin: number): Promise<string[]> {
    const { startISO, endISO } = this.utcRangeFromLocalYmd(dateISO, offsetMin);
    const sameDay = await this.apptModel
      .find({ slotISO: { $gte: startISO, $lte: endISO } })
      .lean();

    return sameDay.map((a) => this.utcIsoToLocalHHmm(a.slotISO as unknown as string, offsetMin));
  }
}
