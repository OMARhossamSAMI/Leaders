// whatsapp.service.ts
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Types, type Model } from 'mongoose';
import fetch from 'node-fetch';
import { WaSend } from 'src/Schemas/wa-send.schema';

type AppDoc = {
  _id: any;
  data?: {
    father_email?: string;
    mother_email?: string;
    father_phone?: string;
    mother_phone?: string;
    student_name?: string;
  };
  createdAt?: Date;
};

type ApptDoc = {
  _id: any;
  parentEmail?: string;
  applicationId?: any;
  slotISO?: string;
};

@Injectable()
export class WhatsappService {
  private readonly log = new Logger('WhatsappService');

  // --- env getters
  private get TOKEN() {
    return process.env.WHATSAPP_TOKEN ?? process.env.WA_TOKEN ?? '';
  }
  private get PHONE_ID() {
    return (
      process.env.WHATSAPP_PHONE_NUMBER_ID ??
      process.env.WA_PHONE_NUMBER_ID ??
      ''
    );
  }
  private get TEMPLATE_NAME() {
    // e.g. 'post_visit' or 'post_visit2'
    return process.env.WA_TEMPLATE_NAME ?? 'assessment_confirmation';
  }
  private get TEMPLATE_LANG() {
    // use 'en' if your template language is English in WhatsApp Manager
    return process.env.WA_TEMPLATE_LANG ?? 'en_US';
  }
  private get POLAROID_URL() {
    return process.env.POLAROID_IMAGE_URL || '';
  }
  private get DEFAULT_COUNTRY() {
    return (process.env.DEFAULT_COUNTRY || 'EG').toUpperCase();
  }

  private get CUSTOM_TEMPLATE_NAME() {
    return process.env.WA_CUSTOM_TEMPLATE_NAME ?? 'admin_custom';
  }
  private get CUSTOM_TEMPLATE_LANG() {
    return (
      process.env.WA_CUSTOM_TEMPLATE_LANG ??
      process.env.WA_TEMPLATE_LANG ??
      'en_US'
    );
  }
  private get CUSTOM_TEMPLATE_HAS_HEADER() {
    return (
      (process.env.WA_CUSTOM_TEMPLATE_HAS_HEADER || 'false').toLowerCase() ===
      'true'
    );
  }

  // ---- header media & survey config (env) ----
  private get HEADER_IMAGE_URL() {
    // keep POLAROID as a fallback for image header
    return process.env.WA_HEADER_IMAGE_URL ?? this.POLAROID_URL ?? '';
  }
  private get HEADER_VIDEO_URL() {
    return process.env.WA_HEADER_VIDEO_URL ?? '';
  }
  private get SURVEY_FULL_URL() {
    // Optional: if you also want to show a full link in the body ({{3}})
    return process.env.WA_SURVEY_FULL_URL ?? '';
  }

  // Button handling
  private get SURVEY_BTN_ENABLED() {
    // turn on only if your template actually has a URL button
    return (
      (process.env.WA_SURVEY_BTN_ENABLED || 'false').toLowerCase() === 'true'
    );
  }
  private get SURVEY_BTN_IS_DYNAMIC() {
    // true only if the button URL contains {{1}} in WhatsApp Manager
    return (
      (process.env.WA_SURVEY_BTN_DYNAMIC || 'false').toLowerCase() === 'true'
    );
  }
  private get SURVEY_BTN_INDEX() {
    // index of the button in the template (0 for first)
    return process.env.WA_SURVEY_BTN_INDEX ?? '0';
  }
  private buildSurveyParam(appOrApptId?: string) {
    // value to substitute into {{1}} when using dynamic URL buttons
    return appOrApptId ?? 'survey';
  }

  constructor(
    private readonly config: ConfigService,
    @InjectModel('Application') private readonly appModel: Model<AppDoc>,
    @InjectModel(WaSend.name) private readonly waSendModel: Model<WaSend>,
    @InjectModel('Appointment') private readonly apptModel: Model<ApptDoc>,
  ) {}

  // ---------- helpers ----------
  private escape(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // EG-focused normalizer; extend as needed
  private normPhoneEgypt(p?: string): string | null {
    if (!p) return null;
    const digits = p.replace(/[^\d+]/g, '');
    if (digits.startsWith('+')) return digits; // already intl
    if (this.DEFAULT_COUNTRY === 'EG') {
      if (digits.startsWith('0')) return `+20${digits.slice(1)}`; // 0XXXXXXXXXX -> +20XXXXXXXXXX
      if (/^\d{10,15}$/.test(digits)) return `+${digits}`;
      return null;
    }
    if (/^\d{10,15}$/.test(digits)) return `+${digits}`;
    return null;
  }

  private fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
  private fmtTime(iso: string) {
    return new Date(iso).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private apiUrl() {
    if (!this.PHONE_ID) {
      throw new BadRequestException('WHATSAPP_PHONE_NUMBER_ID is missing.');
    }
    return `https://graph.facebook.com/v20.0/${this.PHONE_ID}/messages`;
  }

  private apiHeaders() {
    if (!this.TOKEN) {
      throw new BadRequestException('WHATSAPP_TOKEN is missing.');
    }
    return {
      Authorization: `Bearer ${this.TOKEN}`,
      'Content-Type': 'application/json',
    };
  }

  // ---------- idempotency claim (appointment or application+slot) ----------
  // Allow retry if not yet sent; block only after sentAt is set.
  // Respect a "locked" flag to avoid concurrent sends.
  // 1) Claim function: allow non-schema paths during upsert
  private insertedFromAck(ack: any): number {
    if (typeof ack?.upsertedCount === 'number') return ack.upsertedCount;
    if (Array.isArray(ack?.upserted)) return ack.upserted.length;
    if (ack?.upsertedId) return 1;
    return 0;
  }

  /** One row per (apptId + template) OR (appId + slotISO + template). */
  private async claimSendOnceByApptOrAppSlot(args: {
    template: string;
    apptId?: Types.ObjectId | null;
    appId?: Types.ObjectId | null;
    slotISO?: string | null;
  }) {
    const { template, apptId, appId, slotISO } = args;
    const filter = apptId ? { apptId, template } : { appId, slotISO, template };
    const now = new Date();

    const res = await this.waSendModel.updateOne(
      filter,
      { $setOnInsert: { ...filter, createdAt: now } },
      { upsert: true },
    );

    const inserted = this.insertedFromAck(res) > 0;

    let alreadySent = false;
    if (!inserted) {
      const existing = await this.waSendModel
        .findOne(filter)
        .select({ sentAt: 1 })
        .lean();
      alreadySent = !!existing?.sentAt;
    }

    return { inserted, alreadySent, filter };
  }

  // ---------- Meta senders ----------
  private async sendViaMetaTemplate(
    toRaw: string,
    bodyParams: Array<string | number> = [], // ← NEW
  ) {
    const to = toRaw.replace(/^\+/, ''); // WABA expects digits only
    const url = this.apiUrl();

    // Build components only if you actually have params
    const components =
      bodyParams.length > 0
        ? [
            {
              type: 'body',
              parameters: bodyParams.map((p) => ({
                type: 'text',
                text: String(p),
              })),
            },
          ]
        : undefined;

    const payload = {
      messaging_product: 'whatsapp' as const,
      to,
      type: 'template' as const,
      template: {
        name: this.TEMPLATE_NAME, // e.g. "post_message"
        language: { code: this.TEMPLATE_LANG }, // e.g. "en"
        ...(components ? { components } : {}), // include only when present
      },
    };

    this.log.debug(`[META:TEMPLATE] POST ${url} -> to=${to}`);
    const r = await fetch(url, {
      method: 'POST',
      headers: this.apiHeaders(),
      body: JSON.stringify(payload),
    });

    const txt = await r.text();
    this.log.debug(`[META:TEMPLATE] status=${r.status} body=${txt}`);
    if (!r.ok) {
      throw new BadRequestException(
        `WhatsApp template send failed (${r.status}).`,
      );
    }

    try {
      const wamid = JSON.parse(txt)?.messages?.[0]?.id;
      if (wamid) this.log.log(`[META:TEMPLATE] wamid=${wamid}`);
    } catch {
      /* ignore JSON parse issues */
    }

    return true;
  }

  private async sendViaMetaCustomTemplate(toRaw: string, message: string) {
    const to = toRaw.replace(/^\+/, ''); // Meta expects digits only
    const url = this.apiUrl();

    const components: any[] = [
      {
        type: 'body',
        parameters: [{ type: 'text', text: message }],
      },
    ];

    // Optional: add header if your custom template requires it
    if (this.CUSTOM_TEMPLATE_HAS_HEADER && this.POLAROID_URL) {
      components.unshift({
        type: 'header',
        parameters: [{ type: 'image', image: { link: this.POLAROID_URL } }],
      });
    }

    const payload = {
      messaging_product: 'whatsapp' as const,
      to,
      type: 'template' as const,
      template: {
        name: this.CUSTOM_TEMPLATE_NAME,
        language: { code: this.CUSTOM_TEMPLATE_LANG },
        components,
      },
    };

    this.log.debug(`[META:CUSTOM] POST ${url} -> to=${to}`);
    const r = await fetch(url, {
      method: 'POST',
      headers: this.apiHeaders(),
      body: JSON.stringify(payload),
    });

    const txt = await r.text();
    this.log.debug(`[META:CUSTOM] status=${r.status} body=${txt}`);

    if (!r.ok) {
      throw new BadRequestException(
        `WhatsApp custom send failed (${r.status}).`,
      );
    }

    try {
      const wamid = JSON.parse(txt)?.messages?.[0]?.id;
      if (wamid) this.log.log(`[META:CUSTOM] wamid=${wamid}`);
    } catch {
      /* ignore */
    }

    // Always return success, even if called multiple times for same appointment
    return true;
  }

  // ---------- Public API ----------
  async sendAssessment(dto: {
  parentEmail?: string;
  applicationId?: string;
  appointmentId?: string; // required here for idempotency
  slotISO: string;
}) {
  this.log.log(`[IN] sendAssessment dto=${JSON.stringify(dto)}`);

  // ---- Resolve application (id first, then parent email)
  let app: AppDoc | null = null;
  if (dto.applicationId && Types.ObjectId.isValid(dto.applicationId)) {
    app = await this.appModel.findById(dto.applicationId).lean();
  }
  if (!app && dto.parentEmail) {
    const email = dto.parentEmail.trim();
    const query = {
      $or: [
        { 'data.father_email': { $regex: `^${this.escape(email)}$`, $options: 'i' } },
        { 'data.mother_email': { $regex: `^${this.escape(email)}$`, $options: 'i' } },
      ],
    };
    app = await this.appModel.findOne(query).lean();
  }
  if (!app) {
    throw new BadRequestException('Application not found for provided email/id');
  }

  if (!dto.appointmentId || !Types.ObjectId.isValid(dto.appointmentId)) {
    throw new BadRequestException('appointmentId is required and must be valid.');
  }
  const apptId = new Types.ObjectId(dto.appointmentId);

  // ---- Idempotent claim (relies on your unique indexes)
  const { inserted, alreadySent, filter } = await this.claimSendOnceByApptOrAppSlot({
    template: this.TEMPLATE_NAME, // e.g. "post_message"
    apptId,
    appId: app._id as any,
    slotISO: dto.slotISO,
  });

  if (!inserted && alreadySent) {
    this.log.log(`[SKIP] already sent for appointment/app+slot: ${JSON.stringify(filter)}`);
    return { ok: true, sent: [], skipped: ['already-sent-for-appointment'] };
  }

  // ---- Collect phones
  const raw = [app.data?.father_phone, app.data?.mother_phone].filter(Boolean) as string[];
  const phones = [...new Set(raw.map((p) => this.normPhoneEgypt(p)).filter(Boolean))] as string[];
  if (phones.length === 0) {
    throw new BadRequestException('No valid phone numbers on the application.');
  }

  // ---- Body parameter (survey link)
  const surveyUrl = this.config.get<string>('SURVEY_URL');
  if (!surveyUrl) {
    throw new BadRequestException('SURVEY_URL is not configured.');
  }

  const sent: string[] = [];

  try {
    for (const to of phones) {
      // Template now has ONE body placeholder => pass as a single parameter
      await this.sendViaMetaTemplate(to, [surveyUrl]);
      sent.push(to);
    }

    await this.waSendModel.updateOne(filter, {
      $set: { sentAt: new Date(), phonesTried: phones, phonesSent: sent },
    });

    return { ok: true, sent, skipped: [] };
  } catch (e) {
    // keep a record; a later retry will reuse the same wa_sends row
    await this.waSendModel.updateOne(filter, {
      $set: {
        error: e instanceof Error ? e.message : String(e),
        phonesTried: phones,
        phonesSent: sent,
      },
    });
    throw e;
  }
}


  // Send custom message to multiple appointments (unlimited; no idempotency)
  async sendCustomToAppointments(appointmentIds: string[], message: string) {
    if (!message?.trim()) {
      throw new BadRequestException('Message is required.');
    }

    const results: Array<{
      appointmentId: string;
      sent: string[];
      skipped: string[];
    }> = [];

    for (const id of appointmentIds) {
      if (!Types.ObjectId.isValid(id)) {
        results.push({ appointmentId: id, sent: [], skipped: ['invalid-id'] });
        continue;
      }

      // Load the appointment
      const appt = await this.apptModel
        .findById(id, { parentEmail: 1, applicationId: 1, slotISO: 1 })
        .lean();

      if (!appt) {
        results.push({
          appointmentId: id,
          sent: [],
          skipped: ['appointment-not-found'],
        });
        continue;
      }

      // Resolve the application to get parent phones (by id first, then email)
      let app: AppDoc | null = null;
      if (
        appt.applicationId &&
        Types.ObjectId.isValid(String(appt.applicationId))
      ) {
        app = await this.appModel.findById(appt.applicationId).lean();
      }
      if (!app && appt.parentEmail) {
        const email = String(appt.parentEmail).trim();
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
        app = await this.appModel.findOne(query).lean();
      }

      if (!app) {
        results.push({
          appointmentId: id,
          sent: [],
          skipped: ['application-not-found'],
        });
        continue;
      }

      // Collect & normalize both parents’ phones
      const raw = [app.data?.father_phone, app.data?.mother_phone].filter(
        Boolean,
      ) as string[];
      const phones = [
        ...new Set(raw.map((p) => this.normPhoneEgypt(p)).filter(Boolean)),
      ] as string[];

      if (phones.length === 0) {
        results.push({
          appointmentId: id,
          sent: [],
          skipped: ['no-valid-phones'],
        });
        continue;
      }

      // 🔁 Always send (no wa_sends claim/log)
      const sent: string[] = [];
      const skipped: string[] = [];
      for (const to of phones) {
        try {
          await this.sendViaMetaCustomTemplate(to, message.trim());
          sent.push(to);
        } catch (e) {
          this.log.warn(
            `[CUSTOM] send failed to ${to}: ${e instanceof Error ? e.message : e}`,
          );
          skipped.push(to);
        }
      }

      results.push({ appointmentId: id, sent, skipped });
    }

    return { ok: true, results };
  }
}
