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

    @InjectModel(StudentApplication.name)
    private readonly appModel: Model<StudentApplicationDocument>,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly studentAppService: StudentApplicationService, // <-- add this
    private readonly acceptedStudentService: AcceptedStudentService,
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

// …
async listAll(opts?: { upcoming?: boolean; q?: string }) {
  const filter: any = {};
  if (opts?.upcoming) filter.slotISO = { $gte: new Date().toISOString() };
  if (opts?.q) filter.parentEmail = { $regex: this.escapeRegex(opts.q), $options: 'i' };

  // 1) pull appointments
  const docs = await this.apptModel
    .find(filter, { parentEmail: 1, slotISO: 1, applicationId: 1, createdAt: 1 })
    .sort({ slotISO: 1 })
    .lean()
    .exec();

  // 2) collect valid application ids (string or ObjectId)
  const appIds = Array.from(
    new Set(
      docs
        .map(d => d.applicationId)
        .filter((id: any) => !!id)
        .map((id: any) => (typeof id === 'string' ? id : String(id)))
        .filter(id => Types.ObjectId.isValid(id))
        .map(id => new Types.ObjectId(id))
    )
  );

  // 3) fetch student_name in one query
  const apps = appIds.length
    ? await this.appModel
        .find({ _id: { $in: appIds } }, { 'data.student_name': 1 })
        .lean()
        .exec()
    : [];

  const nameById = new Map<string, string | undefined>(
    apps.map((a: any) => [String(a._id), a?.data?.student_name?.trim?.()])
  );

  // 4) return appointments with studentName attached
  return docs.map((d: any) => ({
    _id: String(d._id),
    parentEmail: d.parentEmail,
    slotISO: d.slotISO,
    applicationId: d.applicationId ? String(d.applicationId) : undefined,
    createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : undefined,
    studentName: d.applicationId ? nameById.get(String(d.applicationId)) || undefined : undefined,
  }));
}

async removeById(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid appointment id');
    }
    const res = await this.apptModel.deleteOne({ _id: new Types.ObjectId(id) }).exec();
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
    const { applicationId, parentEmail, slotISO } = dto;

    // Config
    const secretKey = this.config.get<string>('PAYMOB_SECRET_KEY');
    const publicKey = this.config.get<string>('PAYMOB_PUBLIC_KEY');
    const base = this.config.get<string>('PAYMOB_BASE');
    const integrationId = this.config.get<string>('PAYMOB_INTEGRATION_ID');
    if (!secretKey || !publicKey || !base || !integrationId) {
      throw new BadRequestException('Payment configuration is missing');
    }

    const amountCents = 500000; // 5000 EGP

    // 🔍 Lookup student application
    const appDoc = await this.findApplication(applicationId, parentEmail);
    if (!appDoc)
      throw new BadRequestException('Application not found for payment');

    const data = appDoc.data || {};
    const studentName =
      data.student_name || data.student || appDoc.student_name || 'Student';
    const fatherName = data.father_name || data.guardian_name || 'Parent';

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
            email: (parentEmail || '').toLowerCase(),
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
            email: (parentEmail || '').toLowerCase(),
          },
          extras: {
            applicationId,
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
      to: 'omar.hossam3@gmail.com', // replace with HR email
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

  private async sendWelcomeVideoMessage(phoneNumber: string) {
    const normalizedPhone = this.normalizePhoneNumber(phoneNumber);
    console.log(
      '📲 Sending admissions_welcome_video WhatsApp template to:',
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
              name: 'admissions_welcome_video',
              language: { code: 'en' },
              components: [
                {
                  type: 'header',
                  parameters: [
                    {
                      type: 'video',
                      video: {
                        link: 'https://leadersintcollege.com/assets/img/education/Video2.mp4',
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

      console.log('✅ admissions_welcome_video sent:', response.data);
      return response.data;
    } catch (err) {
      console.error(
        '❌ Failed to send admissions_welcome_video:',
        err?.response?.data || err,
      );
      throw err;
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

      if (extras?.applicationId && extras?.parentEmail && extras?.slotISO) {
        console.log('✅ Required extras found:', {
          applicationId: extras.applicationId,
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
          applicationId: extras.applicationId,
          parentEmail: extras.parentEmail,
          slotISO: extras.slotISO, // <-- pass as-is
        };

        await this.create(dto);
        console.log('🎉 Appointment created successfully');

        // ✅ Send WhatsApp message using AcceptedStudentService
        try {
          const dateStr = cairoDate.toLocaleDateString('en-GB');
          const timeStr = cairoDate.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          });

          const waRes = await this.acceptedStudentService.sendAssessmentMessage(
            extras.applicationId, // assuming this id exists in acceptedStudentModel
            {
              fatherName: extras.fatherName || 'Parent',
              studentName: extras.student_name || 'Student',
              date: dateStr,
              time: timeStr,
              phoneNumber:
                extras.fatherPhone ||
                extras.motherPhone ||
                extras.allPhones?.[0],
            },
          );

          console.log('📲 WhatsApp API response:', waRes);

          // === NEW: Send Intro PDF ===
          await this.sendIntroPdfMessage(
            extras.fatherPhone || extras.motherPhone,
          );

          // === NEW: Send Welcome Video ===
          await this.sendWelcomeVideoMessage(
            extras.fatherPhone || extras.motherPhone,
          );

          // ✅ Send HR Email as well
          await this.sendHrAppointmentEmail(extras, cairoDate);
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
        'http://localhost:3001/admissions/appointments/Thankyou',
      );
    } catch (err) {
      console.error('🔥 Redirect error:', err?.response?.data || err);
      return res.redirect(
        'http://localhost:3001/admissions/appointments/Declined',
      );
    }
  }
}
