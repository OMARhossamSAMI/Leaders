// src/appointments/appointments.service.ts
import {
  BadRequestException,
  Injectable,
  Logger,
  Inject,
  Optional,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import type { Response } from 'express';
import { Model, Types } from 'mongoose';
import * as sgMail from '@sendgrid/mail';
import { StudentApplicationService } from '../student-application/student-application.service';
import {
  Appointment,
  AppointmentDocument,
} from '../Schemas/appointment.schema';
import {
  StudentApplication,
  StudentApplicationDocument,
} from '../Schemas/studentApplication.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AcceptedStudentService } from '../accepted-student/accepted-student.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SettingsService } from '../settings/settings.service';

// --- Scheduling window & capacity (30-min slots) ---
const START_HOUR = 9; // 09:00
const CLOSE_HOUR = 12; // window closes at 12:30 (last start 12:00)
const CLOSE_MIN = 30; // 12:30
const SLOT_MINUTES = 30; // 30-min steps
const MAX_PER_SLOT = 2; // <= 2 bookings per slot

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  private readonly fromEmail: string;
  private readonly fromName: string;
  private readonly admissionsEmail: string;
  private readonly schoolName: string;

  constructor(
    @InjectModel(Appointment.name)
    private readonly apptModel: Model<AppointmentDocument>,
    @InjectModel('WaSend')
    private readonly waSendModel: Model<any>,

    @InjectModel(StudentApplication.name)
    private readonly appModel: Model<StudentApplicationDocument>,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly studentAppService: StudentApplicationService, // <-- add this
    private readonly acceptedStudentService: AcceptedStudentService,
    private readonly settingsService: SettingsService,
  ) {}

  // ------------------------ Utils ------------------------

  private escape(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  private escapeRegex(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /** Generate all 30-min start times 09:00..12:00 (local) as HH:mm */
  private generateSlots(): string[] {
    const times: string[] = [];
    let h = START_HOUR,
      m = 0;
    const endExclusive = CLOSE_HOUR * 60 + CLOSE_MIN; // 12:30
    while (h * 60 + m < endExclusive) {
      times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      m += SLOT_MINUTES;
      if (m >= 60) {
        h += Math.floor(m / 60);
        m = m % 60;
      }
    }
    return times;
  }

  /** Next 30-minute boundary in local time (e.g., 10:07 -> 10:30; 10:30 -> 10:30) */
  private nextHalfHourHHmm(localNow: Date): string {
    const h = localNow.getHours();
    const m = localNow.getMinutes();
    const rounded = Math.ceil(m / SLOT_MINUTES) * SLOT_MINUTES; // 0 or 30
    let nh = h,
      nm = rounded;
    if (rounded === 60) {
      nh = h + 1;
      nm = 0;
    }
    const hh = String(nh).padStart(2, '0');
    const mm = String(nm).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  /** From a local YYYY-MM-DD + JS offset (UTC - local), compute UTC start/end ISO range for that local day. */
  private utcRangeFromLocalYmd(dateISO: string, offsetMin: number) {
    const [y, m, d] = dateISO.split('-').map(Number);
    const startUtcMs = Date.UTC(y, m - 1, d, 0, 0, 0, 0) + offsetMin * 60_000;
    const endUtcMs =
      Date.UTC(y, m - 1, d, 23, 59, 59, 999) + offsetMin * 60_000;
    return {
      startISO: new Date(startUtcMs).toISOString(),
      endISO: new Date(endUtcMs).toISOString(),
    };
  }

  /** Convert a stored UTC ISO into local HH:mm using JS offset (UTC - local). */
  private utcIsoToLocalHHmm(utcISO: string, offsetMin: number): string {
    const utc = new Date(utcISO);
    const localMs = utc.getTime() - offsetMin * 60_000; // local = UTC - offset
    const local = new Date(localMs);
    return local.toISOString().substring(11, 16); // HH:mm
  }

  /** Find an application by id or parent email (father/mother). */
  private async findApplication(applicationId?: string, parentEmail?: string) {
    let application: any = null;

    if (applicationId && Types.ObjectId.isValid(applicationId)) {
      application = await this.appModel.findById(applicationId).lean();
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
      application = await this.appModel.findOne(query).lean();
    }

    return application;
  }

  // ------------------------ Email helpers (Admissions on payment success) ------------------------

  private canSendMail() {
    return !!this.config.get<string>('SENDGRID_API_KEY');
  }

  private s(v: unknown, fallback = ''): string {
    if (v === null || v === undefined) return fallback;
    if (typeof v === 'string') return v;
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }

  /** Format the slot in Cairo local (date + time) */
  private formatCairo(isoUtc: string) {
    const d = new Date(isoUtc);
    const date = d.toLocaleDateString('en-GB', { timeZone: 'Africa/Cairo' });
    const time = d.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Africa/Cairo',
    });
    return { date, time };
  }

  /** HTML for the Admissions "paid successfully" email */
  private buildAdmissionsPaidHtml(params: {
    studentName: string;
    parentName: string;
    parentEmail: string;
    slotISO: string; // UTC ISO
    orderId?: string; // optional Paymob order id
  }) {
    const { date, time } = this.formatCairo(params.slotISO);
    const orderLine = params.orderId
      ? `<p style="margin:8px 0"><strong>Order ID:</strong> ${this.s(params.orderId)}</p>`
      : '';

    return `
      <div style="font-family:Arial,sans-serif;background:#f6f8fb;padding:24px;border-radius:8px;border:1px solid #e3e8ef">
        <h2 style="margin:0 0 12px;background:#0b4b7a;color:#fff;padding:12px 16px;border-radius:6px">
          Payment Received — Assessment Booking
        </h2>
        <p style="margin:8px 0">Dear Admissions,</p>
        <p style="margin:8px 0">
          The parent has <strong>paid successfully</strong> and booked an assessment slot.
        </p>
        ${orderLine}
        <table border="1" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:#fff;margin-top:8px">
          <tbody>
            <tr><td style="padding:8px;font-weight:600">Parent Name</td><td style="padding:8px">${this.s(params.parentName, 'Parent')}</td></tr>
            <tr><td style="padding:8px;font-weight:600">Parent Email</td><td style="padding:8px">${this.s(params.parentEmail)}</td></tr>
            <tr><td style="padding:8px;font-weight:600">Student Name</td><td style="padding:8px">${this.s(params.studentName, 'Student')}</td></tr>
            <tr><td style="padding:8px;font-weight:600">Assessment Date</td><td style="padding:8px">${date}</td></tr>
            <tr><td style="padding:8px;font-weight:600">Assessment Time</td><td style="padding:8px">${time} (Africa/Cairo)</td></tr>
          </tbody>
        </table>
        <p style="margin-top:16px;color:#667085;font-size:12px">
          This message was generated by the ${this.schoolName} admissions system.
        </p>
      </div>
    `;
  }

  private async sendAdmissionsPaidEmail(opts: {
    application: any;
    parentEmail: string;
    slotISO: string; // UTC ISO
    orderId?: string;
  }) {
    if (!this.canSendMail()) return;

    const data = (opts.application?.data || {}) as Record<string, any>;
    const studentName =
      data.student_name ||
      data.student ||
      opts.application?.student_name ||
      'Student';
    const parentName =
      data.father_name || data.guardian_name || data.mother_name || 'Parent';

    const msg = {
      to: 'ahmedbhaa2004.ab@gmail.com',
      from: { email: this.fromEmail, name: this.fromName },
      subject: `Payment Received — Assessment Booking for ${studentName}`,
      html: this.buildAdmissionsPaidHtml({
        studentName,
        parentName,
        parentEmail: opts.parentEmail,
        slotISO: opts.slotISO,
        orderId: opts.orderId,
      }),
    } as sgMail.MailDataRequired;

    await sgMail.send(msg);
  }

  // ------------------------ Core booking ------------------------

  async create(dto: CreateAppointmentDto) {
    const { applicationId, parentEmail, slotISO } = dto;

    if (!slotISO) throw new BadRequestException('slotISO is required');
    const slot = new Date(slotISO);
    if (isNaN(slot.getTime()))
      throw new BadRequestException('Invalid slot date/time');
    const slotUtcISO = slot.toISOString();

    // Past time guard
    if (slot.getTime() <= Date.now()) {
      throw new BadRequestException('This time has already passed');
    }

    // Application lookup
    const application = await this.findApplication(applicationId, parentEmail);
    if (!application) throw new BadRequestException('Application not found');

    // Business rules
    // 1) No Fri/Sat
    const dow = slot.getDay(); // 0=Sun, 5=Fri, 6=Sat
    if (dow === 5 || dow === 6) {
      throw new BadRequestException(
        'Appointments are not available on Friday or Saturday',
      );
    }

    // 2) Within two weeks from application createdAt (compare date-only)
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

    // interpret slot in Cairo local time
    const cairo = new Date(
      slot.toLocaleString('en-US', { timeZone: 'Africa/Cairo' }),
    );

    const hh = cairo.getHours();
    const mm = cairo.getMinutes();

    this.logger.log(`🕒 Business rule check (Cairo): hh=${hh}, mm=${mm}`);

    const totalMin = hh * 60 + mm;
    const openMin = START_HOUR * 60; // 540
    const closeMin = CLOSE_HOUR * 60 + CLOSE_MIN; // 750
    const lastStartMin = closeMin - SLOT_MINUTES; // 720 (12:00)

    if (mm % SLOT_MINUTES !== 0) {
      throw new BadRequestException('Slots must align to 30-minute intervals');
    }
    if (totalMin < openMin || totalMin > lastStartMin) {
      throw new BadRequestException('Slots must start between 09:00 and 12:00');
    }

    // 4) Capacity check (max 2 per exact slot) — transaction
    const session = await this.apptModel.db.startSession();
    try {
      let created: AppointmentDocument | null = null;

      await session.withTransaction(async () => {
        const count = await this.apptModel
          .countDocuments({ slotISO: slotUtcISO })
          .session(session);
        if (count >= MAX_PER_SLOT) {
          throw new BadRequestException('This slot is full');
        }

        const [doc] = await this.apptModel.create(
          [
            {
              applicationId: application._id as Types.ObjectId,
              parentEmail,
              slotISO: slotUtcISO,
            },
          ],
          { session },
        );
        created = doc;

        await this.appModel.updateOne(
          { _id: application._id, state: { $ne: 'waiting_for_assessment' } },
          { $set: { state: 'waiting_for_assessment' } },
          { session },
        );
      });

      // ❗️No emails here. Emails are sent only after payment success in the redirect handler.

      return {
        _id: created!.id,
        applicationId: (application._id as Types.ObjectId).toString(),
        slotISO: created!.slotISO,
      };
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new BadRequestException('This slot is full');
      }
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async listAll(opts?: { upcoming?: boolean; q?: string }) {
    const filter: any = {};
    if (opts?.upcoming) filter.slotISO = { $gte: new Date().toISOString() };
    if (opts?.q)
      filter.parentEmail = { $regex: this.escapeRegex(opts.q), $options: 'i' };

    const docs = await this.apptModel
      .find(filter)
      .sort({ slotISO: 1 })
      .lean()
      .exec();

    // Collect appointment & application identifiers
    const apptIds: Types.ObjectId[] = [];
    const appObjectIds: Types.ObjectId[] = [];
    const appCodes: string[] = [];

    for (const d of docs) {
      // appointment ObjectId
      try {
        apptIds.push(new Types.ObjectId(String(d._id)));
      } catch {}

      // application reference (can be ObjectId or code)
      if (d.applicationId) {
        const val = String(d.applicationId);
        if (/^[0-9a-fA-F]{24}$/.test(val)) {
          // looks like ObjectId
          appObjectIds.push(new Types.ObjectId(val));
        } else {
          // treat as appointmentCode
          appCodes.push(val);
        }
      }
    }

    // Map: appointment -> sentAt (for assessment template)
    const template = process.env.WA_TEMPLATE_NAME ?? 'post_message';
    const sends = apptIds.length
      ? await this.waSendModel
          .find({ apptId: { $in: apptIds }, template })
          .select({ apptId: 1, sentAt: 1 })
          .lean()
      : [];
    const sentByAppt = new Map<string, Date | null>(
      sends.map((s) => [String(s.apptId), s.sentAt ?? null]),
    );

    // --- Fetch related applications ---
    const orConditions: Record<string, unknown>[] = [];
    if (appObjectIds.length) orConditions.push({ _id: { $in: appObjectIds } });
    if (appCodes.length)
      orConditions.push({ appointmentCode: { $in: appCodes } });

    const apps = orConditions.length
      ? await this.appModel
          .find({ $or: orConditions })
          .select({ _id: 1, appointmentCode: 1, data: 1, student_name: 1 })
          .lean()
      : [];

    // --- Map application ID/code → name & grade ---
    const nameByApp = new Map<string, string>();
    const gradeByApp = new Map<string, string>();

    for (const a of apps) {
      const data: any = a?.data || {};

      const sn =
        typeof data.student_name === 'string' && data.student_name.trim()
          ? data.student_name.trim()
          : typeof data.student === 'string' && data.student.trim()
            ? data.student.trim()
            : typeof data.child_name === 'string' && data.child_name.trim()
              ? data.child_name.trim()
              : '';
      if (sn) {
        nameByApp.set(String(a._id), sn);
        if (a.appointmentCode) nameByApp.set(String(a.appointmentCode), sn);
      }

      const asText = (v: any) =>
        typeof v === 'string'
          ? v.trim()
          : typeof v === 'number'
            ? String(v)
            : '';
      const gradeCandidates = [
        data.grade_applying_for,
        data.gradeApplyingFor,
        data.applied_grade,
        data.target_grade,
        data.desired_grade,
        data.entry_grade,
        data.grade,
      ];
      const sg = gradeCandidates.map(asText).find((x) => x);
      if (sg) {
        gradeByApp.set(String(a._id), sg);
        if (a.appointmentCode) gradeByApp.set(String(a.appointmentCode), sg);
      }
    }

    // --- Build final response ---
    return docs.map((d) => ({
      _id: String(d._id),
      parentEmail: d.parentEmail,
      slotISO: d.slotISO,
      applicationId: d.applicationId ? String(d.applicationId) : undefined,
      studentName: d.applicationId
        ? nameByApp.get(String(d.applicationId)) || undefined
        : undefined,
      studentGrade: d.applicationId
        ? gradeByApp.get(String(d.applicationId)) || undefined
        : undefined,
      createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : undefined,
      waSentAt: sentByAppt.get(String(d._id)) ?? null,
    }));
  }

  async removeById(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid appointment id');
    }
    const res = await this.apptModel
      .deleteOne({ _id: new Types.ObjectId(id) })
      .exec();
    return res.deletedCount === 1;
  }

  /** Return only available HH:mm strings for the given local day (hides full slots). */
  async availableTimesForDate(dateISO: string, offsetMin: number) {
    const { startISO, endISO } = this.utcRangeFromLocalYmd(dateISO, offsetMin);

    const docs = await this.apptModel
      .find({ slotISO: { $gte: startISO, $lte: endISO } })
      .lean();

    const counts = new Map<string, number>();
    for (const a of docs) {
      const t = this.utcIsoToLocalHHmm(
        a.slotISO as unknown as string,
        offsetMin,
      );
      counts.set(t, (counts.get(t) || 0) + 1);
    }

    const all = this.generateSlots();
    let available = all.filter((t) => (counts.get(t) || 0) < MAX_PER_SLOT);

    // Cut off past times for "today"
    const nowUtcMs = Date.now();
    const nowLocal = new Date(nowUtcMs - offsetMin * 60_000);
    const todayLocalY = nowLocal.getFullYear();
    const todayLocalM = String(nowLocal.getMonth() + 1).padStart(2, '0');
    const todayLocalD = String(nowLocal.getDate()).padStart(2, '0');
    const todayLocalYmd = `${todayLocalY}-${todayLocalM}-${todayLocalD}`;

    if (dateISO === todayLocalYmd) {
      const cutoff = this.nextHalfHourHHmm(nowLocal);
      available = available.filter((t) => t >= cutoff);
    }

    return { times: available };
  }

  async getTakenTimesForDate(
    dateISO: string,
    offsetMin: number,
  ): Promise<string[]> {
    const { startISO, endISO } = this.utcRangeFromLocalYmd(dateISO, offsetMin);
    const sameDay = await this.apptModel
      .find({ slotISO: { $gte: startISO, $lte: endISO } })
      .lean();
    return sameDay.map((a) =>
      this.utcIsoToLocalHHmm(a.slotISO as unknown as string, offsetMin),
    );
  }

  // ------------------------ Paymob: Start Payment ------------------------

  async startPayment(dto: CreateAppointmentDto) {
    const { applicationId, slotISO } = dto;
    console.log('💰 Application called with:', applicationId);
    // Config
    const secretKey = this.config.get<string>('PAYMOB_SECRET_KEY');
    const publicKey = this.config.get<string>('PAYMOB_PUBLIC_KEY');
    const base = this.config.get<string>('PAYMOB_BASE');
    const integrationId = this.config.get<string>('PAYMOB_INTEGRATION_ID');
    if (!secretKey || !publicKey || !base || !integrationId) {
      throw new BadRequestException('Payment configuration is missing');
    }

    // 🔹 Get amount dynamically from settings
    const settings = await this.settingsService.getSettings();
    if (settings?.amount == null) {
      throw new BadRequestException('Appointment fee not configured');
    }

    // Already stored in "cents" (e.g. 400000 for 4000 EGP)
    const amountCents = settings.amount;

    // 🔍 Lookup student application (by ID only now)
    if (!applicationId || applicationId.length < 4) {
      throw new BadRequestException('Valid appointment code is required');
    }

    const appDoc = await this.appModel
      .findOne({ appointmentCode: applicationId })
      .lean();
    if (!appDoc)
      throw new BadRequestException('Application not found for payment');

    const data = appDoc.data || {};

    // Extract required info
    const studentName = data.student_name || data.student || 'Student';
    const fatherName = data.father_name || data.guardian_name || 'Parent';
    const parentEmail = data.father_email || data.mother_email;
    if (!parentEmail) {
      throw new BadRequestException(
        'No parent email found for this application',
      );
    }

    const fatherPhone = data.father_phone || data.fatherPhone;
    const motherPhone = data.mother_phone || data.motherPhone;
    const allPhones: string[] = [
      fatherPhone,
      motherPhone,
      ...(Array.isArray(data.phones) ? data.phones : []),
    ].filter(Boolean);
    const primaryPhone = allPhones[0] || '+201000000000';

    // === STEP 1: Create Intention ===
    const intentionRes = await firstValueFrom(
      this.http.post(
        `${base}/v1/intention/`,
        {
          amount: amountCents,
          currency: 'EGP',
          payment_methods: [Number(integrationId)],
          items: [
            {
              name: 'Assessment Fee',
              amount: amountCents,
              description: 'School assessment booking',
              quantity: 1,
            },
          ],
          billing_data: {
            apartment: 'NA',
            email: parentEmail.toLowerCase(),
            floor: 'NA',
            first_name: studentName,
            last_name: fatherName,
            street: 'NA',
            building: 'NA',
            phone_number: primaryPhone,
            shipping_method: 'NA',
            postal_code: 'NA',
            city: 'Cairo',
            country: 'EG',
            state: 'Cairo',
          },
          customer: {
            first_name: studentName,
            last_name: fatherName,
            email: parentEmail.toLowerCase(),
          },
          extras: {
            appointmentCode: applicationId, // ✅ clear label in extras
            parentEmail,
            slotISO, // keep as provided; normalized later
            student_name: studentName,
            fatherName,
            fatherPhone,
            motherPhone,
            allPhones,
          },
        },
        { headers: { Authorization: `Token ${secretKey}` } },
      ),
    );

    const clientSecret: string | undefined = intentionRes?.data?.client_secret;
    if (!clientSecret)
      throw new BadRequestException('Failed to create payment intention');

    const checkoutUrl = `${base}/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${clientSecret}`;
    return { checkout_url: checkoutUrl };
  }

  private normalizePhoneNumber(input: string): string {
    if (!input) return '';
    // Remove everything except digits
    let digits = input.replace(/\D/g, '');

    // If it starts with "0", strip it and prefix with Egypt country code (20)
    if (digits.startsWith('0')) {
      digits = '20' + digits.slice(1);
    }

    // If it doesn’t start with a country code, add Egypt’s
    if (!digits.startsWith('20') && !digits.startsWith('1')) {
      digits = '20' + digits;
    }

    return digits;
  }

  private async sendHrAppointmentEmail(extras: any, cairoDate: Date) {
    console.log('📧 Preparing HR email for appointment:', extras);

    const {
      student_name,
      fatherName,
      parentEmail,
      fatherPhone,
      motherPhone,
      allPhones,
      applicationId,
      slotISO,
    } = extras;

    const dateStr = cairoDate.toLocaleDateString('en-GB');
    const timeStr = cairoDate.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const hrHtml = `
  <div style="font-family: Arial, sans-serif; color: #333; background-color: #f7f9fc; padding: 30px; max-width: 750px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
    <h2 style="color: #ffffff; background-color: #004080; padding: 15px 20px; border-radius: 4px; text-align: center;">
      ✅ A Parent has booked an Assessment Slot
    </h2>

    <p style="font-size: 16px; margin-bottom: 20px; text-align: center;">
      A parent has successfully booked a slot at <strong>${timeStr}</strong> on <strong>${dateStr}</strong>.
    </p>

    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      
      <tr>
        <td style="padding: 10px; border: 1px solid #ccc;"><strong>Student Name</strong></td>
        <td style="padding: 10px; border: 1px solid #ccc;">${student_name || 'N/A'}</td>
      </tr>
      <tr style="background-color: #e9eff7;">
        <td style="padding: 10px; border: 1px solid #ccc;"><strong>Father Name</strong></td>
        <td style="padding: 10px; border: 1px solid #ccc;">${fatherName || 'N/A'}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ccc;"><strong>Parent Email</strong></td>
        <td style="padding: 10px; border: 1px solid #ccc;">${parentEmail}</td>
      </tr>
      <tr style="background-color: #e9eff7;">
        <td style="padding: 10px; border: 1px solid #ccc;"><strong>Father Phone</strong></td>
        <td style="padding: 10px; border: 1px solid #ccc;">${fatherPhone || 'N/A'}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ccc;"><strong>Mother Phone</strong></td>
        <td style="padding: 10px; border: 1px solid #ccc;">${motherPhone || 'N/A'}</td>
      </tr>
      <tr style="background-color: #e9eff7;">
        <td style="padding: 10px; border: 1px solid #ccc;"><strong>Converted Cairo Time</strong></td>
        <td style="padding: 10px; border: 1px solid #ccc;">${dateStr} at ${timeStr}</td>
      </tr>
    </table>

    <p style="margin-top: 30px; font-style: italic; text-align: center; color: #555;">
      This appointment was booked via Paymob redirect. Please contact the parent for confirmation if needed.
    </p>
  </div>
  `;

    const hrNotification = {
      to: 'Admission@leadersintcollege.com', // replace with HR email
      from: {
        email: 'admission@leadersintcollege.com',
        name: 'Admissions Appointments',
      },
      subject: `📅 New Appointment Booking - ${student_name || 'Student'} `,
      html: hrHtml,
    };

    try {
      await sgMail.send(hrNotification);
      console.log('✅ HR email sent successfully');
    } catch (err) {
      console.error('❌ Failed to send HR email:', err?.response?.body || err);
    }
  }
  private async sendIntroPdfMessage(phoneNumber: string) {
    const normalizedPhone = this.normalizePhoneNumber(phoneNumber);
    console.log(
      '📲 Sending admissions_intro_pdf WhatsApp template to:',
      normalizedPhone,
    );

    try {
      const response = await firstValueFrom(
        this.http.post(
          `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
          {
            messaging_product: 'whatsapp',
            to: normalizedPhone,
            type: 'template',
            template: {
              name: 'admissions_intro_pdf',
              language: { code: 'en' },
              components: [
                {
                  type: 'header',
                  parameters: [
                    {
                      type: 'document',
                      document: {
                        link: 'https://leadersintcollege.com/assets/img/Omar_Hossam_cv.pdf',
                        filename: 'Omar_Hossam_cv.pdf',
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      console.log('✅ admissions_intro_pdf sent:', response.data);
      return response.data;
    } catch (err) {
      console.error(
        '❌ Failed to send admissions_intro_pdf:',
        err?.response?.data || err,
      );
      throw err;
    }
  }

  private async sendWelcomeVideoMessage(
    phoneNumber: string,
    Father_name: string,
  ) {
    const normalizedPhone = this.normalizePhoneNumber(phoneNumber);
    console.log(
      '📲 Sending admissions_welcome_link WhatsApp template to:',
      normalizedPhone,
    );

    try {
      const response = await firstValueFrom(
        this.http.post(
          `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
          {
            messaging_product: 'whatsapp',
            to: normalizedPhone,
            type: 'template',
            template: {
              name: 'admissions_welcome_link', // template name
              language: { code: 'en' },
              components: [
                {
                  type: 'header',
                  parameters: [
                    {
                      type: 'image',
                      image: {
                        link: 'https://leadersintcollege.com/assets/img/Whatapp_LIC.png',
                      },
                    },
                  ],
                },
                {
                  type: 'body',
                  parameters: [
                    {
                      type: 'text',
                      text: Father_name || 'Parent',
                    },
                  ],
                },
                // ❌ No button.parameters here, since URL is static in template
              ],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      console.log('✅ admissions_welcome_link sent:', response.data);
      return response.data;
    } catch (err) {
      console.error(
        '❌ Failed to send admissions_welcome_link:',
        err?.response?.data || err,
      );
      throw err;
    }
  }
  private async sendVideoOptInMessage(phoneNumber: string) {
    const normalizedPhone = this.normalizePhoneNumber(phoneNumber);
    console.log(
      '📲 Sending admissions_video_optin WhatsApp template to:',
      normalizedPhone,
    );

    try {
      const response = await firstValueFrom(
        this.http.post(
          `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
          {
            messaging_product: 'whatsapp',
            to: normalizedPhone,
            type: 'template',
            template: {
              name: 'admissions_video_optin', // 👈 the Utility template you created
              language: { code: 'en' },
            },
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      console.log('✅ admissions_video_optin sent:', response.data);
      return response.data;
    } catch (err) {
      console.error(
        '❌ Failed to send admissions_video_optin:',
        err?.response?.data || err,
      );
      throw err;
    }
  }
  async handleIncomingMessage(msg: any) {
    const from = msg.from; // phone number in WhatsApp format
    const text = msg?.text?.body?.trim()?.toLowerCase();

    this.logger.log(`📥 WA message from ${from}: ${text}`);

    await this.sendWelcomeVideoMessage(from, 'Parent');
  }
  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  private async sendParentPaymentConfirmationEmail(
    extras: any,
    cairoDate: Date,
  ) {
    console.log('📧 Preparing parent confirmation email:', extras);

    const { student_name, fatherName, parentEmail, slotISO } = extras;

    const dateStr = cairoDate.toLocaleDateString('en-GB');
    const timeStr = cairoDate.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const html = `
  <div style="font-family: Arial, sans-serif; color:#333; background:#f7f9fc; padding:30px; max-width:700px; margin:auto; border-radius:8px; border:1px solid #e0e0e0;">
    <h2 style="background:#004080; color:white; padding:15px; text-align:center; border-radius:4px;">
      🎉 Payment Confirmation & Appointment Details
    </h2>
    <p style="font-size:16px;">Dear <strong>${fatherName || 'Parent'}</strong>,</p>
    <p style="font-size:15px; line-height:1.6;">
      We are pleased to confirm that your payment has been successfully received for your child’s assessment appointment.
    </p>
    <h3 style="color:#004080;">📅 Appointment Details</h3>
    <table style="width:100%; border-collapse:collapse;">
      <tr>
        <td style="padding:8px; border:1px solid #ccc;"><strong>Student Name</strong></td>
        <td style="padding:8px; border:1px solid #ccc;">${student_name || 'N/A'}</td>
      </tr>
      <tr style="background:#e9eff7;">
        <td style="padding:8px; border:1px solid #ccc;"><strong>Date</strong></td>
        <td style="padding:8px; border:1px solid #ccc;">${dateStr}</td>
      </tr>
      <tr>
        <td style="padding:8px; border:1px solid #ccc;"><strong>Time</strong></td>
        <td style="padding:8px; border:1px solid #ccc;">${timeStr}</td>
      </tr>
    </table>
    <p style="margin-top:20px; font-size:15px;">
      Kindly make sure to arrive 10–15 minutes before the scheduled time.  
      Our admissions team looks forward to meeting you and your child.
    </p>
    <p style="margin-top:30px; color:#555; font-style:italic;">
      This is an automated message confirming your booking.  
    </p>
  </div>
  `;

    const parentEmailMsg = {
      to: parentEmail,
      from: {
        email: 'admission@leadersintcollege.com',
        name: 'Leaders International College Admissions',
      },
      subject: `✅ Payment Confirmation - Assessment Appointment for ${student_name || 'Student'}`,
      html,
    };

    try {
      await sgMail.send(parentEmailMsg);
      console.log('✅ Parent confirmation email sent successfully');
    } catch (err) {
      console.error(
        '❌ Failed to send parent email:',
        err?.response?.body || err,
      );
    }
  }

  // ------------------------ Paymob: Redirect Handler ------------------------

  async handlePaymobRedirect(query: any, res: Response) {
    try {
      console.log('👉 Redirect query received:', query);

      const isPaid = query?.success === 'true';
      console.log('✅ Success flag:', isPaid);

      if (!isPaid) {
        console.warn('❌ Payment marked as failed in query');
        return res.redirect(
          'http://localhost:3001/admissions/appointments/Declined',
        );
      }

      // Get the order ID from redirect params
      const orderId = query?.order;
      console.log('👉 Order ID from query:', orderId);

      if (!orderId) {
        console.error('❌ No order id in redirect query');
        return res.redirect(
          'http://localhost:3001/admissions/appointments/Declined',
        );
      }

      // === STEP 1: Authenticate to get auth token ===
      const apiKey = this.config.get<string>('PAYMOB_API_KEY');
      const base = this.config.get<string>('PAYMOB_BASE');

      const authRes = await firstValueFrom(
        this.http.post(`${base}/api/auth/tokens`, { api_key: apiKey }),
      );
      const authToken = authRes?.data?.token;
      console.log('🔑 Auth token received:', !!authToken);

      // === STEP 2: Call transaction inquiry with order_id ===
      const trxRes = await firstValueFrom(
        this.http.post(
          `${base}/api/ecommerce/orders/transaction_inquiry`,
          { order_id: orderId },
          { headers: { Authorization: `Bearer ${authToken}` } },
        ),
      );

      console.log('📦 Transaction inquiry response:', trxRes.data);

      // === STEP 3: Extract extras from payment_key_claims.extra ===
      const extras = trxRes.data?.payment_key_claims?.extra;
      console.log('👉 Extracted extras (raw):', extras);
      // 🔹 Support both appointmentCode (new) and applicationId (old)
      const code = extras?.appointmentCode || null;
      console.log('👉 Using appointmentCode:', code);
      if (code && extras?.parentEmail && extras?.slotISO) {
        console.log('✅ Required extras found:', {
          appointmentCode: code,
          parentEmail: extras.parentEmail,
          slotISO: extras.slotISO,
        });

        // 🔎 Log optional extras if present
        if (extras.student_name)
          console.log('👦 Student Name:', extras.student_name);
        if (extras.fatherName)
          console.log('👨 Father Name:', extras.fatherName);
        if (extras.fatherPhone)
          console.log('📞 Father Phone:', extras.fatherPhone);
        if (extras.motherPhone)
          console.log('📞 Mother Phone:', extras.motherPhone);
        if (extras.allPhones) console.log('📱 All Phones:', extras.allPhones);

        // Convert Paymob UTC ISO → Cairo local
        const utcDate = new Date(extras.slotISO);
        const cairoOffsetMinutes = 3 * 60; // UTC+3
        const localMs = utcDate.getTime() + cairoOffsetMinutes * 60_000;
        const cairoDate = new Date(localMs);

        console.log('🕒 Converted Cairo time:', cairoDate.toISOString());

        // ✅ Create appointment
        const dto: CreateAppointmentDto = {
          applicationId: code, // still called applicationId, but it's the code
          parentEmail: extras.parentEmail,
          slotISO: extras.slotISO, // <-- pass as-is
        };

        await this.create(dto);
        console.log('🎉 Appointment created successfully');

        await this.appModel.findOneAndUpdate(
          { appointmentCode: code },
          { hasBookedAppointment: true },
          { new: true },
        );
        console.log('📌 Application marked as booked:', code);

        // ✅ Send WhatsApp message using AcceptedStudentService
        try {
          const dateStr = cairoDate.toLocaleDateString('en-GB');
          const timeStr = cairoDate.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          });

          // const waRes = await this.acceptedStudentService.sendAssessmentMessage(
          //   extras.applicationId, // assuming this id exists in acceptedStudentModel
          //   {
          //     fatherName: extras.fatherName || 'Parent',
          //     studentName: extras.student_name || 'Student',
          //     date: dateStr,
          //     time: timeStr,
          //     phoneNumber:
          //       extras.fatherPhone ||
          //       extras.motherPhone ||
          //       extras.allPhones?.[0],
          //   },
          // );

          // console.log('📲 WhatsApp API response:', waRes);

          await this.delay(5000);

          // === NEW: Send Intro PDF ===
          // await this.sendIntroPdfMessage(
          //   extras.fatherPhone || extras.motherPhone,
          // );
          // await this.delay(10000);
          // === NEW: Ask for reply to unlock video ===
          // await this.sendVideoOptInMessage(
          //   extras.fatherPhone || extras.motherPhone,
          // );

          // === NEW: Send Welcome Video ===
          // await this.sendWelcomeVideoMessage(
          //   extras.fatherPhone || extras.motherPhone,
          //   extras.fatherName || 'Parent',
          // );

          // ✅ Send HR Email as well
          await this.sendHrAppointmentEmail(extras, cairoDate);
          await this.sendParentPaymentConfirmationEmail(extras, cairoDate);
        } catch (waErr) {
          console.error('⚠️ Failed to send WhatsApp message:', waErr);
        }
      } else {
        console.warn(
          '⚠️ Extras not found or incomplete in transaction inquiry',
        );
      }

      // ✅ Redirect to success page
      return res.redirect(
        'https://leadersintcollege.com/admissions/appointments/Thankyou',
      );
    } catch (err) {
      console.error('🔥 Redirect error:', err?.response?.data || err);
      return res.redirect(
        'https://leadersintcollege.com/admissions/appointments/Declined',
      );
    }
  }
  @Cron(CronExpression.EVERY_2_HOURS) // runs every hour
  async sendRemindersForUpcomingAppointments() {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // find appointments within the next 24h, not already reminded
    const upcoming = await this.apptModel
      .find({
        reminderSent: false,
        slotISO: { $gte: now.toISOString(), $lte: in24h.toISOString() },
      })
      .lean();

    for (const appt of upcoming) {
      try {
        const app = await this.appModel.findById(appt.applicationId).lean();
        if (!app) continue;

        const data = app.data || {};
        const studentName = data.student_name || 'Student';
        const parentName =
          data.father_name ||
          data.guardian_name ||
          data.mother_name ||
          'Parent';
        const fatherPhone = data.father_phone || '';
        const motherPhone = data.mother_phone || '';

        const phone = fatherPhone || motherPhone;
        if (!phone) {
          this.logger.warn(`⚠️ No phone number for appointment ${appt._id}`);
          continue;
        }

        // Format date/time for Cairo
        const d = new Date(appt.slotISO);
        const dateStr = d.toLocaleDateString('en-GB', {
          timeZone: 'Africa/Cairo',
        });
        const timeStr = d.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Africa/Cairo',
        });

        // 👉 send WA template "admissions_reminder"
        await firstValueFrom(
          this.http.post(
            `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
              messaging_product: 'whatsapp',
              to: this.normalizePhoneNumber(phone),
              type: 'template',
              template: {
                name: 'assessment_reminder',
                language: { code: 'en' },
                components: [
                  {
                    type: 'body',
                    parameters: [
                      { type: 'text', text: parentName },
                      { type: 'text', text: studentName },
                      { type: 'text', text: dateStr },
                      { type: 'text', text: timeStr },
                    ],
                  },
                ],
              },
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
              },
            },
          ),
        );

        this.logger.log(`✅ Reminder sent for appointment ${appt._id}`);

        // mark as sent
        await this.apptModel.updateOne(
          { _id: appt._id },
          { $set: { reminderSent: true } },
        );
      } catch (err) {
        this.logger.error(
          `❌ Failed to send reminder for ${appt._id}:`,
          err?.response?.data || err,
        );
      }
    }
  }
}
