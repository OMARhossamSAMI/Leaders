import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Interval } from '@nestjs/schedule';
import { Model, Types } from 'mongoose';
import * as sgMail from '@sendgrid/mail';
import * as fs from 'fs';
import { join } from 'path';
import { MailLog, MailLogDocument } from '../Schemas/mail-log.schema';
import {
  StudentApplication,
  StudentApplicationDocument,
} from '../Schemas/studentApplication.schema';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

/** server/uploads, the same folder main.ts serves and multer writes to. */
export const UPLOADS_DIR = join(__dirname, '..', '..', 'uploads');

/** Waits before each re-send: 30 min, 2 h, 6 h, 24 h. Then it gives up. */
export const RETRY_DELAYS_MIN = [30, 120, 360, 1440];

export type OutgoingMail = {
  to: string | string[];
  from: { email: string; name?: string };
  subject: string;
  html: string;
  attachments?: {
    content: string;
    filename: string;
    type?: string;
    disposition?: string;
  }[];
};

export type SendOptions = {
  /** application | application-parent | contact | vacancy | internship | tour | appointment | payment-issue */
  kind: string;
  refId?: string | null;
  /** Send again when it isn't delivered. True for the school's own mailboxes. */
  retry?: boolean;
  /** Files (inside uploads/) to attach again on a re-send. */
  attachmentFiles?: { file: string; filename: string; type: string }[];
};

/** Which warning an email's failure puts on its application. */
const ISSUE_KIND: Record<string, 'admissions' | 'parent'> = {
  application: 'admissions',
  'application-parent': 'parent',
};

const lower = (s: unknown) => String(s ?? '').trim().toLowerCase();

function errorText(err: any): string {
  const body = err?.response?.body;
  const fromBody = Array.isArray(body?.errors)
    ? body.errors.map((e: any) => e?.message).filter(Boolean).join('; ')
    : '';
  return (fromBody || err?.message || String(err)).slice(0, 500);
}

function isTooLarge(err: any): boolean {
  const code = err?.code ?? err?.response?.statusCode;
  return code === 413 || /too large|exceeds|payload/i.test(errorText(err));
}

@Injectable()
export class SchoolMailService {
  constructor(
    @InjectModel(MailLog.name)
    private readonly logModel: Model<MailLogDocument>,
    @InjectModel(StudentApplication.name)
    private readonly appModel: Model<StudentApplicationDocument>,
  ) {}

  /**
   * Sends an email through SendGrid and keeps a record of it, so it can be
   * sent again if it isn't delivered. Never throws: a failure is recorded
   * (and retried when `retry` is on) instead of failing the caller's request.
   */
  async send(
    msg: OutgoingMail,
    opts: SendOptions,
  ): Promise<{ ok: boolean; logId: string | null }> {
    const to = (Array.isArray(msg.to) ? msg.to : [msg.to])
      .map((t) => String(t ?? '').trim())
      .filter(Boolean);

    let log: MailLogDocument | null = null;
    try {
      log = await this.logModel.create({
        kind: opts.kind,
        refId: opts.refId ?? null,
        retry: opts.retry ?? true,
        to,
        from: msg.from,
        subject: msg.subject,
        html: msg.html,
        attachmentFiles: opts.attachmentFiles ?? [],
        status: 'sending',
      });
    } catch (err) {
      console.error('⚠️ Could not record an outgoing email:', err);
    }

    if (!log) {
      // Without a record we can't retry, but the email still goes out.
      try {
        await sgMail.send(msg as sgMail.MailDataRequired);
        return { ok: true, logId: null };
      } catch (err) {
        console.error(`❌ SendGrid error (${opts.kind}):`, errorText(err));
        return { ok: false, logId: null };
      }
    }

    const ok = await this.deliver(log, msg.html, msg.attachments);
    return { ok, logId: String(log._id) };
  }

  /** One send attempt. Records the outcome on the log. */
  private async deliver(
    log: MailLogDocument,
    html: string,
    attachments: OutgoingMail['attachments'],
  ): Promise<boolean> {
    const mail = (withFiles: boolean, extraHtml = '') =>
      ({
        // One recipient goes as plain text, exactly as the callers sent it.
        to: log.to.length === 1 ? log.to[0] : log.to,
        from: log.from,
        subject: log.subject,
        html: html + extraHtml,
        attachments: withFiles && attachments?.length ? attachments : undefined,
        customArgs: { mail_log_id: String(log._id) },
      }) as sgMail.MailDataRequired;

    let reason = '';
    try {
      const [res] = await sgMail.send(mail(true));
      await this.recordAccepted(log, res);
      return true;
    } catch (err) {
      reason = errorText(err);
      if (attachments?.length && isTooLarge(err)) {
        // SendGrid takes at most 30 MB. Send the details without the files.
        try {
          const [res] = await sgMail.send(
            mail(
              false,
              `<p style="color:#b45309"><strong>The attached files were too large to send by email. Open this application in the website admin to see them.</strong></p>`,
            ),
          );
          await this.recordAccepted(log, res, 'sent without attachments (too large)');
          return true;
        } catch (err2) {
          reason = errorText(err2);
        }
      }
    }

    console.error(`❌ SendGrid error (${log.kind} ${log._id}):`, reason);
    await this.logModel.updateOne(
      { _id: log._id },
      { $push: { attempts: { at: new Date(), messageId: null, result: 'error', reason } } },
    );
    log.attempts.push({ at: new Date(), messageId: null, result: 'error', reason });
    await this.failed(log, 'failed', reason, log.to.join(', '));
    return false;
  }

  private async recordAccepted(log: MailLogDocument, res: any, note?: string) {
    const headers = res?.headers ?? {};
    const messageId =
      headers['x-message-id'] ?? headers['X-Message-Id'] ?? null;
    await this.logModel.updateOne(
      { _id: log._id },
      {
        $set: { status: 'sent', nextRetryAt: null },
        $push: {
          attempts: {
            at: new Date(),
            messageId,
            result: 'accepted',
            reason: note,
          },
        },
      },
    );
  }

  /**
   * The email wasn't delivered (SendGrid refused it, or the receiving server
   * did). Schedules the next try, or gives up, and warns on the application.
   */
  private async failed(
    log: MailLogDocument,
    status: 'failed' | 'not_delivered',
    reason: string,
    address: string,
  ) {
    const sends = log.attempts.length;
    if (log.retry) {
      const delay = RETRY_DELAYS_MIN[sends - 1];
      if (delay === undefined) {
        await this.logModel.updateOne(
          { _id: log._id },
          { $set: { status: 'gave_up', nextRetryAt: null } },
        );
        await this.warn(log, address, `Not delivered after ${sends} tries: ${reason}`, true);
        return;
      }
      await this.logModel.updateOne(
        { _id: log._id },
        { $set: { status, nextRetryAt: new Date(Date.now() + delay * 60_000) } },
      );
    } else {
      await this.logModel.updateOne(
        { _id: log._id },
        { $set: { status, nextRetryAt: null } },
      );
    }
    await this.warn(log, address, reason, false);
  }

  /** Puts (or refreshes) a warning on the email's application. */
  private async warn(
    log: MailLogDocument,
    address: string,
    reason: string,
    gaveUp: boolean,
  ) {
    const kind = ISSUE_KIND[log.kind];
    if (!kind || !log.refId || !Types.ObjectId.isValid(log.refId)) return;
    const to = lower(address);
    const fields = {
      reason: reason.slice(0, 500),
      at: new Date(),
      resolved: false,
      retrying: log.retry && !gaveUp,
    };
    try {
      const res = await this.appModel.updateOne(
        { _id: log.refId, emailIssues: { $elemMatch: { kind, to } } },
        {
          $set: Object.fromEntries(
            Object.entries(fields).map(([k, v]) => [`emailIssues.$.${k}`, v]),
          ),
        },
      );
      if (res.matchedCount === 0) {
        await this.appModel.updateOne(
          { _id: log.refId },
          { $push: { emailIssues: { kind, to, ...fields } } },
        );
      }
    } catch (err) {
      console.error('⚠️ Could not record an email warning:', err);
    }
  }

  private async clearWarning(log: MailLogDocument, address: string) {
    const kind = ISSUE_KIND[log.kind];
    if (!kind || !log.refId || !Types.ObjectId.isValid(log.refId)) return;
    try {
      await this.appModel.updateOne(
        { _id: log.refId, emailIssues: { $elemMatch: { kind, to: lower(address) } } },
        { $set: { 'emailIssues.$.resolved': true, 'emailIssues.$.retrying': false } },
      );
    } catch (err) {
      console.error('⚠️ Could not clear an email warning:', err);
    }
  }

  /**
   * SendGrid's Event Webhook: what happened to each email after SendGrid
   * accepted it. Only emails sent through `send()` carry `mail_log_id`.
   */
  async handleEvents(events: any[]) {
    for (const ev of events) {
      try {
        await this.handleEvent(ev);
      } catch (err) {
        console.error('⚠️ Could not process a SendGrid event:', err);
      }
    }
  }

  private async handleEvent(ev: any) {
    const id = ev?.mail_log_id;
    if (typeof id !== 'string' || !Types.ObjectId.isValid(id)) return;
    const type = String(ev.event ?? '');
    const log = await this.logModel.findById(id);
    if (!log) return;
    const address = lower(ev.email) || log.to.join(', ');

    if (type === 'delivered') {
      if (log.status !== 'delivered') {
        // Every recipient's events arrive separately; a school mailbox log
        // has one recipient, so its delivery ends the retries.
        await this.logModel.updateOne(
          { _id: log._id, status: { $ne: 'delivered' } },
          { $set: log.retry ? { status: 'delivered', nextRetryAt: null } : { status: 'delivered' } },
        );
      }
      await this.clearWarning(log, address);
      return;
    }

    if (!['bounce', 'blocked', 'dropped'].includes(type)) return;
    const reason = String(ev.reason || ev.type || type).slice(0, 500);

    // A late event from an earlier try must not start another round.
    const last = log.attempts[log.attempts.length - 1];
    const evMsg = String(ev.sg_message_id ?? '');
    if (last?.messageId && evMsg && !evMsg.startsWith(last.messageId)) return;

    if (log.retry) {
      // Claim the log so two events can't both schedule a re-send.
      const claimed = await this.logModel.findOneAndUpdate(
        { _id: log._id, status: 'sent' },
        {
          $set: {
            status: 'not_delivered',
            [`attempts.${log.attempts.length - 1}.result`]: 'not_delivered',
            [`attempts.${log.attempts.length - 1}.reason`]: reason,
          },
        },
        { new: true },
      );
      if (!claimed) return;
      await this.failed(claimed, 'not_delivered', reason, address);
    } else {
      await this.logModel.updateOne(
        { _id: log._id },
        { $set: { status: 'not_delivered' } },
      );
      await this.warn(log, address, reason, false);
    }
  }

  @Interval(5 * 60_000)
  async retryTick() {
    try {
      await this.retryDue(new Date());
    } catch (err) {
      console.error('⚠️ Email retry run failed:', err);
    }
  }

  /** Sends again every email whose next try is due. */
  async retryDue(now: Date = new Date()) {
    let count = 0;
    for (let i = 0; i < 20; i++) {
      const log = await this.logModel.findOneAndUpdate(
        {
          retry: true,
          status: { $in: ['failed', 'not_delivered'] },
          nextRetryAt: { $lte: now },
        },
        { $set: { status: 'sending', nextRetryAt: null } },
        { new: true, sort: { nextRetryAt: 1 } },
      );
      if (!log) break;
      count++;

      const attachments: NonNullable<OutgoingMail['attachments']> = [];
      let missing = 0;
      for (const f of log.attachmentFiles ?? []) {
        try {
          const buf = await fs.promises.readFile(join(UPLOADS_DIR, f.file));
          attachments.push({
            content: buf.toString('base64'),
            filename: f.filename,
            type: f.type || 'application/octet-stream',
            disposition: 'attachment',
          });
        } catch {
          missing++;
        }
      }
      const note =
        `<p style="font-family:Arial,sans-serif;font-size:13px;color:#b45309;background:#fff7ed;border:1px solid #fed7aa;padding:8px 12px;border-radius:6px">` +
        `Sent again automatically: the first delivery of this email failed.` +
        (missing
          ? ` ${missing} attached file(s) could not be attached again; they are in the website admin.`
          : '') +
        `</p>`;
      await this.deliver(log, note + log.html, attachments);
    }
    return count;
  }
}
