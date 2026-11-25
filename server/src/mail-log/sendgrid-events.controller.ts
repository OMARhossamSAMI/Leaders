import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Headers,
  HttpCode,
  Post,
  Req,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import axios from 'axios';
import { createPublicKey, verify, KeyObject } from 'crypto';
import { SchoolMailService } from './school-mail.service';

const SIGNATURE = 'x-twilio-email-event-webhook-signature';
const TIMESTAMP = 'x-twilio-email-event-webhook-timestamp';

function toKey(base64Der: string): KeyObject {
  return createPublicKey({
    key: Buffer.from(base64Der.trim(), 'base64'),
    format: 'der',
    type: 'spki',
  });
}

/**
 * SendGrid's signed Event Webhook (Settings → Mail Settings → Event Webhook):
 * tells the site when an email it sent was delivered, refused ("blocked"),
 * bounced or dropped. Requests must carry SendGrid's ECDSA signature.
 */
@Controller('sendgrid')
export class SendgridEventsController {
  private keys: KeyObject[] = [];
  private fetchedAt = 0;

  constructor(private readonly mail: SchoolMailService) {}

  /** The webhooks' public keys, read from SendGrid with the site's API key. */
  private async publicKeys(refresh: boolean): Promise<KeyObject[]> {
    const fixed = process.env.SENDGRID_WEBHOOK_PUBLIC_KEY;
    if (fixed) return [toKey(fixed)];

    // Ask SendGrid at most every 5 minutes, and only when needed.
    const fresh = this.fetchedAt > 0 && Date.now() - this.fetchedAt < 5 * 60_000;
    if (fresh) return this.keys;
    if (this.keys.length && !refresh) return this.keys;

    this.fetchedAt = Date.now();
    const api = axios.create({
      baseURL: 'https://api.sendgrid.com/v3/user/webhooks/event/settings',
      headers: { Authorization: `Bearer ${process.env.SENDGRID_API_KEY}` },
      timeout: 10_000,
    });
    try {
      const { data } = await api.get<any>('/all');
      const keys: KeyObject[] = [];
      for (const hook of data?.webhooks ?? []) {
        let pk: string | undefined = hook?.public_key;
        if (!pk && hook?.id) {
          const signed: any = await api
            .get<any>(`/signed/${hook.id}`)
            .catch(() => null);
          pk = signed?.data?.public_key;
        }
        if (pk) keys.push(toKey(pk));
      }
      this.keys = keys;
    } catch (err: any) {
      console.error('⚠️ Could not read the SendGrid webhook keys:', err?.message || err);
    }
    return this.keys;
  }

  private matches(keys: KeyObject[], payload: Buffer, signature: string) {
    const sig = Buffer.from(signature, 'base64');
    return keys.some((key) => {
      try {
        return verify('sha256', payload, key, sig);
      } catch {
        return false;
      }
    });
  }

  @Post('events')
  @HttpCode(200)
  async events(
    @Req() req: RawBodyRequest<Request>,
    @Headers(SIGNATURE) signature?: string,
    @Headers(TIMESTAMP) timestamp?: string,
  ) {
    const raw = req.rawBody;
    if (!signature || !timestamp || !raw) {
      throw new ForbiddenException('Missing signature');
    }
    const payload = Buffer.concat([Buffer.from(timestamp, 'utf8'), raw]);

    let keys = await this.publicKeys(false);
    if (!keys.length) {
      // SendGrid retries for 24 hours, so a temporary failure loses nothing.
      throw new ServiceUnavailableException('Webhook key not available yet');
    }
    if (!this.matches(keys, payload, signature)) {
      keys = await this.publicKeys(true); // the key may have been rotated
      if (!this.matches(keys, payload, signature)) {
        throw new ForbiddenException('Bad signature');
      }
    }

    let events: unknown = req.body;
    if (!Array.isArray(events)) {
      try {
        events = JSON.parse(raw.toString('utf8'));
      } catch {
        throw new BadRequestException('Expected a JSON array');
      }
    }
    if (!Array.isArray(events)) {
      throw new BadRequestException('Expected a JSON array');
    }
    await this.mail.handleEvents(events);
    return { ok: true };
  }
}
