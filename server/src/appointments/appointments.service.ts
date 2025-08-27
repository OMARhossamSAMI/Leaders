import { BadRequestException, Injectable, Res } from '@nestjs/common';

import { Response } from 'express';
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
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
// Opening window: 09:00–12:15 every 15 min
const START_HOUR = 9;
const END_HOUR = 12;
const LAST_MIN = 15;

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly apptModel: Model<AppointmentDocument>,

    @InjectModel(StudentApplication.name)
    private readonly appModel: Model<StudentApplicationDocument>,
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  private escape(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async create(dto: CreateAppointmentDto) {
    const { applicationId, parentEmail, slotISO } = dto;

    if (!slotISO) throw new BadRequestException('slotISO is required');
    const slot = new Date(slotISO);
    if (isNaN(slot.getTime())) {
      throw new BadRequestException('Invalid slot date/time');
    }
    const slotUtcISO = slot.toISOString();

    // ⬅️ NEW: block booking in the past (compares in UTC)
    if (slot.getTime() <= Date.now()) {
      throw new BadRequestException('This time has already passed');
    }

    // ---- find application (by id, then by parent email) ----
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

    if (!application) {
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

    // 2) Within two weeks from application createdAt (date-only, local-less)
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

    // 3) 09:00–12:15 window, 15-minute steps
    const hh = slot.getHours();
    const mm = slot.getMinutes();
    if (mm % 15 !== 0) {
      throw new BadRequestException('Slots must align to 15-minute intervals');
    }
    const inRange = hh === 9 || (hh > 9 && hh < 12) || (hh === 12 && mm <= 15);
    if (!inRange) {
      throw new BadRequestException('Slots must be between 09:00 and 12:30');
    }

    // 4) Prevent double booking of the exact slot (canonical UTC compare)
    const already = await this.apptModel
      .findOne({ slotISO: slotUtcISO })
      .lean();
    if (already)
      throw new BadRequestException('This slot has already been booked');

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
      _id: doc.id,
      applicationId: (application._id as Types.ObjectId).toString(),
      slotISO: doc.slotISO,
    };
  }

  private escapeRegex(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

  /** Generate all 15-min slots 09:00..12:15 (local) as HH:mm */
  private generateSlots(): string[] {
    const times: string[] = [];
    let h = 9,
      m = 0;
    while (h < 12 || (h === 12 && m <= 15)) {
      times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      m += 15;
      if (m === 60) {
        m = 0;
        h += 1;
      }
    }
    return times;
  }

  /** Pad HH:mm from a Date */
  private hhmm(dt: Date): string {
    const h = String(dt.getHours()).padStart(2, '0');
    const m = String(dt.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }

  /** Next 15-minute boundary in local time (e.g., 10:07 -> 10:15; 10:15 -> 10:15) */
  private nextQuarterHHmm(localNow: Date): string {
    const h = localNow.getHours();
    const m = localNow.getMinutes();
    const rounded = Math.ceil(m / 15) * 15;
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

  /** Return only available HH:mm strings for the given local day. */
  async availableTimesForDate(dateISO: string, offsetMin: number) {
    const { startISO, endISO } = this.utcRangeFromLocalYmd(dateISO, offsetMin);

    // All appointments whose UTC slot falls within that local day
    const docs = await this.apptModel
      .find({ slotISO: { $gte: startISO, $lte: endISO } })
      .lean();

    const takenSet = new Set(
      docs.map((a) =>
        this.utcIsoToLocalHHmm(a.slotISO as unknown as string, offsetMin),
      ),
    );

    const all = this.generateSlots();
    let available = all.filter((t) => !takenSet.has(t));

    // ⬅️ NEW: if the requested date is "today" (in local time), cut off past times
    const nowUtcMs = Date.now();
    const nowLocal = new Date(nowUtcMs - offsetMin * 60_000); // local = UTC - offset
    const todayLocalY = nowLocal.getFullYear();
    const todayLocalM = String(nowLocal.getMonth() + 1).padStart(2, '0');
    const todayLocalD = String(nowLocal.getDate()).padStart(2, '0');
    const todayLocalYmd = `${todayLocalY}-${todayLocalM}-${todayLocalD}`;

    if (dateISO === todayLocalYmd) {
      const cutoff = this.nextQuarterHHmm(nowLocal); // e.g., 10:07 -> 10:15
      // keep only times >= cutoff
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
  async startPayment(dto: CreateAppointmentDto) {
    const { applicationId, parentEmail, slotISO } = dto;

    const secretKey = this.config.get<string>('PAYMOB_SECRET_KEY');
    const publicKey = this.config.get<string>('PAYMOB_PUBLIC_KEY');
    const base = this.config.get<string>('PAYMOB_BASE');
    const integrationId = this.config.get<string>('PAYMOB_INTEGRATION_ID');

    const amountCents = 500000; // 5000 EGP

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
            email: parentEmail,
            floor: 'NA',
            first_name: 'Parent',
            last_name: 'Name',
            street: 'NA',
            building: 'NA',
            phone_number: '+201280008668',
            shipping_method: 'NA',
            postal_code: 'NA',
            city: 'Cairo',
            country: 'EG',
            state: 'Cairo',
          },
          customer: {
            first_name: 'Parent',
            last_name: 'Name',
            email: parentEmail,
          },
          extras: {
            applicationId,
            parentEmail,
            slotISO,
          },
        },
        {
          headers: {
            Authorization: `Token ${secretKey}`,
          },
        },
      ),
    );

    const clientSecret = intentionRes.data.client_secret;

    // === STEP 2: Build Unified Checkout URL ===
    const checkoutUrl = `${base}/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${clientSecret}`;

    return { checkout_url: checkoutUrl };
  }

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
      console.log('👉 Extracted extras:', extras);

      if (extras?.applicationId && extras?.parentEmail && extras?.slotISO) {
        console.log('✅ All extras found:', {
          applicationId: extras.applicationId,
          parentEmail: extras.parentEmail,
          slotISO: extras.slotISO,
        });

        const dto: CreateAppointmentDto = {
          applicationId: extras.applicationId,
          parentEmail: extras.parentEmail,
          slotISO: extras.slotISO,
        };

        await this.create(dto);
        console.log('🎉 Appointment created successfully');
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
