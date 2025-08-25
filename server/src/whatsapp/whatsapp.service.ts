// whatsapp.service.ts
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import fetch from 'node-fetch';

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

  // --- helpers to read envs with fallbacks
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
  private get SURVEY_URL() {
    return process.env.DEFAULT_SURVEY_URL || 'https://example.com/visit-survey';
  }
  private get DEFAULT_COUNTRY() {
    return (process.env.DEFAULT_COUNTRY || 'EG').toUpperCase();
  }

  constructor(
    @InjectModel('Application') private readonly appModel: Model<AppDoc>,
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

  private buildFreeText(slotISO: string) {
    const d = this.fmtDate(slotISO);
    const t = this.fmtTime(slotISO);
    return (
      `Thank you for choosing Leaders International College!\n\n` +
      `Your child's assessment is booked for *${d}* at *${t}*.\n` +
      `Results will be communicated by phone within 5 working days.\n\n` +
      `Next steps:\n` +
      `• Please arrive 10 minutes early with required documents.\n` +
      `• Parents’ interview may be held the same day.\n\n` +
      `We value your feedback. Please take our short survey:\n` +
      `${this.SURVEY_URL}\n\n` +
      `— Admissions`
    );
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

  private async sendViaMetaText(to: string, body: string) {
    const url = this.apiUrl();
    const payload = {
      messaging_product: 'whatsapp' as const,
      to,
      type: 'text' as const,
      text: { body, preview_url: false },
    };

    this.log.debug(`[META] POST ${url} -> to=${to}`);
    const r = await fetch(url, {
      method: 'POST',
      headers: this.apiHeaders(),
      body: JSON.stringify(payload),
    });

    const txt = await r.text();
    this.log.debug(`[META] status=${r.status} body=${txt}`);
    if (!r.ok)
      throw new BadRequestException(`WhatsApp send failed (${r.status}).`);
    return true;
  }

  // Uses TEMPLATE (required for first outbound message)
  private async sendViaMetaTemplate(toRaw: string, slotISO: string) {
    const to = toRaw.replace(/^\+/, ''); // optional: strip '+'
    const url = this.apiUrl();

    const d = this.fmtDate(slotISO);
    const t = this.fmtTime(slotISO);

    const paramCount = Number(process.env.WA_TEMPLATE_PARAM_COUNT ?? '2'); // default 2
    const components: any[] = [];

    // optional header image (only if your template has a header of type IMAGE!)
    if (this.POLAROID_URL) {
      components.push({
        type: 'header',
        parameters: [{ type: 'image', image: { link: this.POLAROID_URL } }],
      });
    }

    // body parameters – add exactly what the template expects
    const bodyParams: any[] = [];
    if (paramCount >= 1) bodyParams.push({ type: 'text', text: d });
    if (paramCount >= 2) bodyParams.push({ type: 'text', text: t });
    if (bodyParams.length) {
      components.push({ type: 'body', parameters: bodyParams });
    }

    // if there are no components, omit the property entirely
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
    return true;
  }

  async sendAssessment(dto: {
    parentEmail?: string;
    applicationId?: string;
    slotISO: string;
  }) {
    this.log.log(`[IN] dto=${JSON.stringify(dto)}`);

    // 1) Find application by id first, then by email
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

    if (!app) {
      throw new BadRequestException(
        'Application not found for provided email/id',
      );
    }

    // 2) Collect phone numbers from the application
    const phonesRaw = [app.data?.father_phone, app.data?.mother_phone].filter(
      Boolean,
    ) as string[];

    const phones = [
      ...new Set(phonesRaw.map((p) => this.normPhoneEgypt(p)).filter(Boolean)),
    ] as string[];

    this.log.log(
      `[PHONES] raw=${JSON.stringify(phonesRaw)} normalized=${JSON.stringify(phones)}`,
    );

    if (phones.length === 0) {
      throw new BadRequestException(
        'No valid phone numbers on the application.',
      );
    }

    // 3) Send messages (template first if name is configured)
    const useTemplateFirst = !!this.TEMPLATE_NAME;

    for (const to of phones) {
      if (useTemplateFirst) {
        await this.sendViaMetaTemplate(to, dto.slotISO);
      } else {
        const text = this.buildFreeText(dto.slotISO);
        await this.sendViaMetaText(to, text);
      }
    }

    return { ok: true, sent: phones };
  }
}
