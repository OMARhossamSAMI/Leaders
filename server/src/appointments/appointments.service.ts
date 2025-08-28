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

import {
  Appointment,
  AppointmentDocument,
} from '../Schemas/appointment.schema';
import {
  StudentApplication,
  StudentApplicationDocument,
} from '../Schemas/studentApplication.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

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

    // Optional WhatsApp sender — guard all calls
    @Optional()
    @Inject('AcceptedStudentService')
    private readonly acceptedStudentService?: {
      sendAssessmentMessage: (
        applicationId: string,
        payload: {
          fatherName: string;
          studentName: string;
          date: string;
          time: string;
          phoneNumber?: string;
        },
      ) => Promise<any>;
    },
  ) {
    // --- Mail setup ---
    const key = this.config.get<string>('SENDGRID_API_KEY');
    if (key) {
      try {
        sgMail.setApiKey(key);
      } catch (e) {
        this.logger.error('Failed to init SendGrid', e as any);
      }
    } else {
      this.logger.warn(
        'SENDGRID_API_KEY is missing — emails will not be sent.',
      );
    }

    this.fromEmail = 'ahmedbhaa2004.ab@gmail.com';
    this.fromName = this.config.get('MAIL_FROM_NAME') || 'Leaders Admissions';
    this.admissionsEmail = 'ahmedbhaa2004.ab@gmail.com';
    this.schoolName =
      this.config.get('SCHOOL_NAME') || 'Leaders International College';
  }

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
      to: this.admissionsEmail,
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

    return docs.map((d) => ({
      _id: String(d._id),
      parentEmail: d.parentEmail,
      slotISO: d.slotISO,
      applicationId: d.applicationId ? String(d.applicationId) : undefined,
      createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : undefined,
    }));
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

  // ------------------------ Paymob: Redirect Handler ------------------------

  async handlePaymobRedirect(query: any, res: Response) {
    try {
      this.logger.log(`👉 Redirect query received: ${JSON.stringify(query)}`);

      const isPaid = query?.success === 'true';
      this.logger.log(`✅ Success flag: ${isPaid}`);

      if (!isPaid) {
        this.logger.warn('❌ Payment marked as failed in query');
        return res.redirect(
          'http://localhost:3001/admissions/appointments/Declined',
        );
      }

      const orderId = query?.order;
      if (!orderId) {
        this.logger.error('❌ No order id in redirect query');
        return res.redirect(
          'http://localhost:3001/admissions/appointments/Declined',
        );
      }

      // === STEP 1: Authenticate
      const apiKey = this.config.get<string>('PAYMOB_API_KEY');
      const base = this.config.get<string>('PAYMOB_BASE');
      const authRes = await firstValueFrom(
        this.http.post(`${base}/api/auth/tokens`, { api_key: apiKey }),
      );
      const authToken = authRes?.data?.token;
      this.logger.log(`🔑 Auth token received: ${!!authToken}`);

      // === STEP 2: Inquiry
      const trxRes = await firstValueFrom(
        this.http.post(
          `${base}/api/ecommerce/orders/transaction_inquiry`,
          { order_id: orderId },
          { headers: { Authorization: `Bearer ${authToken}` } },
        ),
      );

      this.logger.log(
        `📦 Transaction inquiry response: ${JSON.stringify(trxRes.data)}`,
      );

      const extras = trxRes?.data?.payment_key_claims?.extra;
      this.logger.log(`👉 Extracted extras: ${JSON.stringify(extras)}`);

      if (!(extras?.applicationId && extras?.parentEmail && extras?.slotISO)) {
        this.logger.warn(
          '⚠️ Extras not found or incomplete in transaction inquiry',
        );
        return res.redirect(
          'http://localhost:3001/admissions/appointments/Declined',
        );
      }

      // 🔎 Add logs for slotISO in different views
      this.logger.log(`🕒 Raw extras.slotISO: ${extras.slotISO}`);
      const slotFromExtras = new Date(extras.slotISO);
      this.logger.log(
        `🕒 Parsed Date (toString): ${slotFromExtras.toString()}`,
      );
      this.logger.log(`🕒 Parsed Date (UTC): ${slotFromExtras.toUTCString()}`);
      this.logger.log(
        `🕒 Parsed Date (Cairo): ${slotFromExtras.toLocaleString('en-GB', { timeZone: 'Africa/Cairo' })}`,
      );

      const slotUtcISO = slotFromExtras.toISOString();
      this.logger.log(`🕒 Normalized slotUtcISO: ${slotUtcISO}`);

      // ✅ Create appointment
      const dto: CreateAppointmentDto = {
        applicationId: String(extras.applicationId),
        parentEmail: String(extras.parentEmail),
        slotISO: slotUtcISO,
      };
      this.logger.log(`📌 Appointment DTO to create: ${JSON.stringify(dto)}`);

      await this.create(dto);
      this.logger.log('🎉 Appointment created successfully after payment');

      // ✅ Notify Admissions
      try {
        const application = await this.findApplication(
          String(extras.applicationId),
          String(extras.parentEmail),
        );

        await this.sendAdmissionsPaidEmail({
          application,
          parentEmail: String(extras.parentEmail),
          slotISO: slotUtcISO,
          orderId,
        });

        this.logger.log('📧 Admissions payment email sent.');
      } catch (mailErr) {
        this.logger.error(
          'Failed to send admissions payment email',
          mailErr as any,
        );
      }

      // ✅ WhatsApp follow-up
      if (this.acceptedStudentService?.sendAssessmentMessage) {
        try {
          const cairo = new Date(slotUtcISO);
          const dateStr = cairo.toLocaleDateString('en-GB', {
            timeZone: 'Africa/Cairo',
          });
          const timeStr = cairo.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Africa/Cairo',
          });
          const phoneNumber =
            extras.fatherPhone ||
            extras.motherPhone ||
            (Array.isArray(extras.allPhones) ? extras.allPhones[0] : undefined);

          this.logger.log(
            `📲 Preparing WhatsApp message with date=${dateStr} time=${timeStr} phone=${phoneNumber}`,
          );

          const waRes = await this.acceptedStudentService.sendAssessmentMessage(
            String(extras.applicationId),
            {
              fatherName: String(extras.fatherName || 'Parent'),
              studentName: String(extras.student_name || 'Student'),
              date: dateStr,
              time: timeStr,
              phoneNumber,
            },
          );

          this.logger.log(`📲 WhatsApp API response: ${JSON.stringify(waRes)}`);
        } catch (waErr) {
          this.logger.error(`⚠️ Failed to send WhatsApp message: ${waErr}`);
        }
      }

      return res.redirect(
        'http://localhost:3001/admissions/appointments/Thankyou',
      );
    } catch (err: any) {
      this.logger.error('🔥 Redirect error', err?.response?.data || err);
      return res.redirect(
        'http://localhost:3001/admissions/appointments/Declined',
      );
    }
  }
}
