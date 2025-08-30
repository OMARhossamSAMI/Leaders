// whatsapp.service.ts
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
    return process.env.WA_TEMPLATE_NAME ?? 'assessment_confirmation';
  }
  private get TEMPLATE_LANG() {
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
  return process.env.WA_CUSTOM_TEMPLATE_LANG ?? (process.env.WA_TEMPLATE_LANG ?? 'en_US');
}
private get CUSTOM_TEMPLATE_HAS_HEADER() {
  return ((process.env.WA_CUSTOM_TEMPLATE_HAS_HEADER || 'false').toLowerCase() === 'true');
}


  constructor(
    @InjectModel('Application') private readonly appModel: Model<AppDoc>,
    @InjectModel(WaSend.name) private readonly waSendModel: Model<WaSend>,
    @InjectModel('Appointment') private readonly apptModel: Model<any>,
  ) {}

  private escape(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Basic normalizer; currently tuned for EG
  private normPhoneEgypt(p?: string): string | null {
    if (!p) return null;
    const digits = p.replace(/[^\d+]/g, '');
    if (digits.startsWith('+')) return digits; // already intl

    if (this.DEFAULT_COUNTRY === 'EG') {
      // 0XXXXXXXXXX -> +20XXXXXXXXXX
      if (digits.startsWith('0')) return `+20${digits.slice(1)}`;
      if (/^\d{10,15}$/.test(digits)) return `+${digits}`;
      return null;
    }

    // generic fallback
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

  // Uses TEMPLATE (required for first outbound message)
  private get TEMPLATE_HAS_HEADER() {
    // true only if your template actually contains a HEADER (text or image)
    return (
      (process.env.WA_TEMPLATE_HAS_HEADER || 'false').toLowerCase() === 'true'
    );
  }

  private async sendViaMetaTemplate(toRaw: string, slotISO: string) {
    const to = toRaw.replace(/^\+/, '');
    const url = this.apiUrl();

    const d = this.fmtDate(slotISO);
    const t = this.fmtTime(slotISO);

    const paramCount = Number(process.env.WA_TEMPLATE_PARAM_COUNT ?? '2');
    const components: any[] = [];

    // Include header only if the template has one
    if (this.TEMPLATE_HAS_HEADER) {
      if (this.POLAROID_URL) {
        components.push({
          type: 'header',
          parameters: [{ type: 'image', image: { link: this.POLAROID_URL } }],
        });
      }
      // If using a text header with placeholders, add {type:'text'} parameters here.
    }

    // Body variables ({{1}} = date, {{2}} = time)
    const bodyParams: any[] = [];
    if (paramCount >= 1) bodyParams.push({ type: 'text', text: d });
    if (paramCount >= 2) bodyParams.push({ type: 'text', text: t });
    if (bodyParams.length)
      components.push({ type: 'body', parameters: bodyParams });

    const template: any = {
      name: this.TEMPLATE_NAME,
      language: { code: this.TEMPLATE_LANG },
    };
    if (components.length) template.components = components;

    const payload = {
      messaging_product: 'whatsapp' as const,
      to,
      type: 'template' as const,
      template,
    };

    this.log.debug(`[META:TEMPLATE] POST ${url} -> to=${to}`);
    const r = await fetch(url, {
      method: 'POST',
      headers: this.apiHeaders(),
      body: JSON.stringify(payload),
    });
    const txt = await r.text();
    this.log.debug(`[META:TEMPLATE] status=${r.status} body=${txt}`);
    if (!r.ok)
      throw new BadRequestException(
        `WhatsApp template send failed (${r.status}).`,
      );
    try {
      const wamid = JSON.parse(txt)?.messages?.[0]?.id;
      if (wamid) this.log.log(`[META:TEMPLATE] wamid=${wamid}`);
    } catch {}
    return true;
  }

  async sendAssessment(dto: {
    parentEmail?: string;
    applicationId?: string;
    slotISO: string;
  }) {
    this.log.log(`[IN] dto=${JSON.stringify(dto)}`);

    // --- find application (same as before)
    let app: AppDoc | null = null;
    if (dto.applicationId) {
      this.log.log(`[LOOKUP] byId: ${dto.applicationId}`);
      app = await this.appModel.findById(dto.applicationId).lean();
      this.log.log(`[LOOKUP] byId found=${!!app}`);
    }
    if (!app && dto.parentEmail) {
      const email = dto.parentEmail.trim();
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
      this.log.log(`[LOOKUP] byEmail query=${JSON.stringify(query)}`);
      app = await this.appModel.findOne(query).lean();
      this.log.log(`[LOOKUP] byEmail found=${!!app}`);
    }
    if (!app)
      throw new BadRequestException(
        'Application not found for provided email/id',
      );

    // --- collect & normalize phones
    const phonesRaw = [app.data?.father_phone, app.data?.mother_phone].filter(
      Boolean,
    ) as string[];
    const phones = [
      ...new Set(phonesRaw.map((p) => this.normPhoneEgypt(p)).filter(Boolean)),
    ] as string[];

    this.log.log(
      `[PHONES] raw=${JSON.stringify(phonesRaw)} normalized=${JSON.stringify(phones)}`,
    );
    if (phones.length === 0)
      throw new BadRequestException(
        'No valid phone numbers on the application.',
      );

    const sent: string[] = [];
    const skipped: string[] = [];

    // --- for each parent, send once (idempotent via upsert)
    for (const to of phones) {
      // 1) Try to CLAIM this send by inserting/upserting a log.
      // If a row already exists => we’ve sent before => skip.
      const ack = await this.waSendModel.updateOne(
        { appId: app._id, phone: to, template: this.TEMPLATE_NAME }, // <- add slotISO here as well if you want once-per-slot
        {
          $setOnInsert: {
            appId: app._id,
            phone: to,
            template: this.TEMPLATE_NAME,
            slotISO: dto.slotISO,
            createdAt: new Date(),
          },
        },
        { upsert: true },
      );

      if (
        !('upsertedCount' in ack
          ? ack.upsertedCount
          : (ack as any).upserted
            ? 1
            : 0)
      ) {
        // already existed -> skip
        skipped.push(to);
        continue;
      }

      // 2) We own this send now -> send the template
      await this.sendViaMetaTemplate(to, dto.slotISO);

      // 3) Mark as sent
      await this.waSendModel.updateOne(
        { appId: app._id, phone: to, template: this.TEMPLATE_NAME }, // include slotISO if you used it above
        { $set: { sentAt: new Date() } },
      );

      sent.push(to);
    }

    return { ok: true, sent, skipped };
  }

  // Custom message to multiple appointments
  private async sendViaMetaCustomTemplate(toRaw: string, message: string) {
  const to = toRaw.replace(/^\+/, '');
  const url = this.apiUrl();

  const components: any[] = [];
  if (this.CUSTOM_TEMPLATE_HAS_HEADER && this.POLAROID_URL) {
    components.push({
      type: 'header',
      parameters: [{ type: 'image', image: { link: this.POLAROID_URL } }],
    });
  }
  components.push({
    type: 'body',
    parameters: [{ type: 'text', text: message }],
  });

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

  const r = await fetch(url, { method: 'POST', headers: this.apiHeaders(), body: JSON.stringify(payload) });
  const txt = await r.text();
  this.log.debug(`[META:CUSTOM] status=${r.status} body=${txt}`);
  if (!r.ok) throw new BadRequestException(`WhatsApp custom send failed (${r.status}).`);
  return true;
}

// Send custom message to multiple appointments
async sendCustomToAppointments(appointmentIds: string[], message: string) {
  // Load the appointments
  const ids = appointmentIds
    .filter((id) => Types.ObjectId.isValid(id))
    .map((id) => new Types.ObjectId(id));

  const appts = await this.apptModel
    .find({ _id: { $in: ids } }, { parentEmail: 1, applicationId: 1, slotISO: 1 })
    .lean()
    .exec();

  if (appts.length === 0) {
    throw new BadRequestException('No appointments found for given ids.');
  }

  const results: Array<{ appointmentId: string; sent: string[]; skipped: string[] }> = [];

  for (const a of appts) {
    // Resolve application by id first, then by email (same logic you already use)
    let app: AppDoc | null = null;

    if (a.applicationId && Types.ObjectId.isValid(a.applicationId)) {
      app = await this.appModel.findById(a.applicationId).lean();
    }
    if (!app && a.parentEmail) {
      const email = String(a.parentEmail).trim();
      const query = {
        $or: [
          { 'data.father_email': { $regex: `^${this.escape(email)}$`, $options: 'i' } },
          { 'data.mother_email': { $regex: `^${this.escape(email)}$`, $options: 'i' } },
        ],
      };
      app = await this.appModel.findOne(query).lean();
    }
    if (!app) {
      results.push({ appointmentId: String(a._id), sent: [], skipped: [] });
      continue;
    }

    const raw = [app.data?.father_phone, app.data?.mother_phone].filter(Boolean) as string[];
    const phones = [...new Set(raw.map((p) => this.normPhoneEgypt(p)).filter(Boolean))] as string[];

    const sent: string[] = [];
    const skipped: string[] = [];

    // Optional: you could add an idempotency log for custom sends too.
    // For now, we simply send (no "once only" restriction).
    for (const to of phones) {
      try {
        await this.sendViaMetaCustomTemplate(to, message);
        sent.push(to);
      } catch (e) {
        this.log.warn(`[CUSTOM] send failed to ${to}: ${e instanceof Error ? e.message : e}`);
        // choose to skip or accumulate failures; here we skip silently
      }
    }

    results.push({ appointmentId: String(a._id), sent, skipped });
  }

  return { ok: true, results };
}

}
