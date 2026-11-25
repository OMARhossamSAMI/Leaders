import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as request from 'supertest';
import * as sgMail from '@sendgrid/mail';
import * as fs from 'fs';
import { join } from 'path';
import { generateKeyPairSync, sign } from 'crypto';
import { bootApp } from './app';
import { StudentApplication } from '../src/Schemas/studentApplication.schema';
import { MailLog } from '../src/Schemas/mail-log.schema';
import { ContactUs } from '../src/Schemas/contactus.schema';
import {
  SchoolMailService,
  UPLOADS_DIR,
} from '../src/mail-log/school-mail.service';

// SendGrid signs its Event Webhook with ECDSA (P-256). The test plays SendGrid
// with its own key pair; the server is given the public half.
const { publicKey, privateKey } = generateKeyPairSync('ec', {
  namedCurve: 'prime256v1',
});
process.env.SENDGRID_WEBHOOK_PUBLIC_KEY = publicKey
  .export({ type: 'spki', format: 'der' })
  .toString('base64');

const ADMISSION = 'admission@leadersintcollege.com';
const FATHER = 'father@example.com';
const MOTHER = 'mother@example.com';
const send = sgMail.send as jest.Mock;
const MIN = 60_000;

describe('Emails to the school are sent again when they are refused', () => {
  let app: INestApplication;
  let apps: Model<any>;
  let logs: Model<any>;
  let contacts: Model<any>;
  let mail: SchoolMailService;
  const madeFiles: string[] = [];

  beforeAll(async () => {
    app = await bootApp();
    apps = app.get(getModelToken(StudentApplication.name));
    logs = app.get(getModelToken(MailLog.name));
    contacts = app.get(getModelToken(ContactUs.name));
    mail = app.get(SchoolMailService);
  });

  afterAll(async () => {
    for (const f of madeFiles) await fs.promises.rm(f, { force: true });
    await app.close();
  });

  beforeEach(async () => {
    send.mockReset();
    send.mockResolvedValue([{ statusCode: 202, headers: {} }]);
    await Promise.all([apps.deleteMany({}), logs.deleteMany({}), contacts.deleteMany({})]);
  });

  /** Posts events to the webhook the way SendGrid does. */
  function events(body: object[], signature?: string) {
    const raw = JSON.stringify(body);
    const ts = String(Math.floor(Date.now() / 1000));
    const sig =
      signature ?? sign('sha256', Buffer.from(ts + raw), privateKey).toString('base64');
    return request(app.getHttpServer())
      .post('/sendgrid/events')
      .set('Content-Type', 'application/json')
      .set('X-Twilio-Email-Event-Webhook-Signature', sig)
      .set('X-Twilio-Email-Event-Webhook-Timestamp', ts)
      .send(raw);
  }

  async function apply(withFile = false) {
    let req = request(app.getHttpServer())
      .post('/applications')
      .field('student_name', 'Test Student')
      .field('grade_applying_for', 'KG1 - PYP2')
      .field('father_email', FATHER)
      .field('mother_email', MOTHER);
    if (withFile) {
      req = req.attach('files', Buffer.from('%PDF-1.4 test'), 'birth-certificate.pdf');
    }
    const res = await req;
    expect(res.status).toBe(201);
    const appDoc = await apps.findById(res.body.applicationId).lean<any>();
    for (const f of appDoc.files ?? []) madeFiles.push(join(UPLOADS_DIR, f.path.split('/').pop()));
    const admissions = await logs.findOne({ kind: 'application' }).lean<any>();
    const parent = await logs.findOne({ kind: 'application-parent' }).lean<any>();
    return { id: res.body.applicationId as string, admissions, parent };
  }

  const blocked = (log: any, email = ADMISSION) => ({
    event: 'bounce',
    type: 'blocked',
    email,
    reason:
      '550 5.7.1 Service unavailable, Client host [167.89.18.14] blocked using Spamhaus',
    mail_log_id: String(log._id),
  });
  const delivered = (log: any, email = ADMISSION) => ({
    event: 'delivered',
    email,
    mail_log_id: String(log._id),
  });

  it('records both application emails and tags each one for the webhook', async () => {
    const { id, admissions, parent } = await apply();
    expect(admissions).toMatchObject({ refId: id, retry: true, status: 'sent' });
    expect(admissions.to).toEqual(['Admission@leadersintcollege.com']);
    expect(parent).toMatchObject({ refId: id, retry: false, status: 'sent' });
    expect(parent.to).toEqual([FATHER, MOTHER]);

    const tags = send.mock.calls.map((c) => c[0].customArgs?.mail_log_id).sort();
    expect(tags).toEqual([String(admissions._id), String(parent._id)].sort());
  });

  it('sends a refused Admission@ email again, and delivery clears the warning', async () => {
    const { id, admissions } = await apply();
    const before = Date.now();

    expect((await events([blocked(admissions)])).status).toBe(200);
    let log = await logs.findById(admissions._id).lean<any>();
    expect(log.status).toBe('not_delivered');
    expect(log.nextRetryAt.getTime()).toBeGreaterThanOrEqual(before + 29 * MIN);
    expect(log.attempts[0]).toMatchObject({ result: 'not_delivered' });
    expect(log.attempts[0].reason).toContain('Spamhaus');

    let doc = await apps.findById(id).lean<any>();
    expect(doc.emailIssues).toHaveLength(1);
    expect(doc.emailIssues[0]).toMatchObject({
      kind: 'admissions',
      to: ADMISSION,
      resolved: false,
      retrying: true,
    });

    // The same event again (SendGrid retries webhooks) changes nothing.
    await events([blocked(admissions)]);
    expect((await logs.findById(admissions._id).lean<any>()).attempts).toHaveLength(1);

    send.mockClear();
    expect(await mail.retryDue(new Date())).toBe(0); // not due yet
    expect(await mail.retryDue(new Date(Date.now() + 31 * MIN))).toBe(1);
    expect(send).toHaveBeenCalledTimes(1);
    const again = send.mock.calls[0][0];
    expect(again.to).toBe('Admission@leadersintcollege.com');
    expect(again.subject).toBe(admissions.subject);
    expect(again.html).toContain('Sent again automatically');
    expect(again.customArgs.mail_log_id).toBe(String(admissions._id));
    log = await logs.findById(admissions._id).lean<any>();
    expect(log.status).toBe('sent');
    expect(log.attempts).toHaveLength(2);

    await events([delivered(admissions)]);
    log = await logs.findById(admissions._id).lean<any>();
    expect(log.status).toBe('delivered');
    doc = await apps.findById(id).lean<any>();
    expect(doc.emailIssues[0]).toMatchObject({ resolved: true, retrying: false });

    // A late refusal after delivery doesn't start another round.
    await events([blocked(admissions)]);
    expect((await logs.findById(admissions._id).lean<any>()).status).toBe('delivered');
  });

  it('gives up after 5 tries and says so on the application', async () => {
    const { id, admissions } = await apply();
    let at = Date.now();
    for (let i = 0; i < 4; i++) {
      await events([blocked(admissions)]);
      at += 25 * 60 * MIN;
      expect(await mail.retryDue(new Date(at))).toBe(1);
    }
    await events([blocked(admissions)]);
    const log = await logs.findById(admissions._id).lean<any>();
    expect(log.status).toBe('gave_up');
    expect(log.attempts).toHaveLength(5);
    expect(await mail.retryDue(new Date(at + 48 * 60 * MIN))).toBe(0);

    const doc = await apps.findById(id).lean<any>();
    expect(doc.emailIssues[0].retrying).toBe(false);
    expect(doc.emailIssues[0].resolved).toBe(false);
    expect(doc.emailIssues[0].reason).toMatch(/^Not delivered after 5 tries/);
  });

  it("warns about a parent's address that doesn't exist, without sending again", async () => {
    const { id, parent } = await apply();
    await events([
      {
        event: 'bounce',
        type: 'bounce',
        email: FATHER,
        reason: '550 5.1.1 The email account that you tried to reach does not exist.',
        mail_log_id: String(parent._id),
      },
      delivered(parent, MOTHER),
    ]);
    const doc = await apps.findById(id).lean<any>();
    expect(doc.emailIssues).toHaveLength(1);
    expect(doc.emailIssues[0]).toMatchObject({
      kind: 'parent',
      to: FATHER,
      resolved: false,
      retrying: false,
    });
    send.mockClear();
    expect(await mail.retryDue(new Date(Date.now() + 48 * 60 * MIN))).toBe(0);
    expect(send).not.toHaveBeenCalled();
  });

  it('refuses events without a valid SendGrid signature', async () => {
    const { admissions } = await apply();
    const raw = JSON.stringify([blocked(admissions)]);
    const noSig = await request(app.getHttpServer())
      .post('/sendgrid/events')
      .set('Content-Type', 'application/json')
      .send(raw);
    expect(noSig.status).toBe(403);
    const forged = await events(
      [blocked(admissions)],
      sign('sha256', Buffer.from('other'), privateKey).toString('base64'),
    );
    expect(forged.status).toBe(403);
    expect((await logs.findById(admissions._id).lean<any>()).status).toBe('sent');
  });

  it('keeps the application and answers 201 when SendGrid itself fails', async () => {
    send.mockRejectedValue({
      code: 400,
      message: 'Bad Request',
      response: { body: { errors: [{ message: 'Does not contain a valid address.' }] } },
    });
    const { id, admissions, parent } = await apply();
    expect(admissions.status).toBe('failed');
    expect(admissions.nextRetryAt).toBeTruthy();
    expect(parent.status).toBe('failed');
    const doc = await apps.findById(id).lean<any>();
    const kinds = doc.emailIssues.map((i: any) => i.kind).sort();
    expect(kinds).toEqual(['admissions', 'parent']);
    expect(doc.emailIssues.find((i: any) => i.kind === 'parent').reason).toContain(
      'valid address',
    );
  });

  it('sends without the files when they are too large, and re-attaches what is left on a re-send', async () => {
    send.mockImplementation(async (msg: any) => {
      if (msg.attachments?.length && !msg.html.includes('Sent again')) {
        throw { code: 413, message: 'Payload Too Large' };
      }
      return [{ statusCode: 202, headers: {} }];
    });
    const { admissions } = await apply(true);
    expect(admissions.status).toBe('sent');
    expect(admissions.attempts[0].reason).toContain('without attachments');
    expect(admissions.attachmentFiles).toHaveLength(1);
    const sentWithout = send.mock.calls
      .map((c) => c[0])
      .find((m) => m.customArgs.mail_log_id === String(admissions._id) && !m.attachments);
    expect(sentWithout.html).toContain('too large to send by email');

    // A re-send attaches the file again from uploads/…
    await events([blocked(admissions)]);
    send.mockClear();
    await mail.retryDue(new Date(Date.now() + 31 * MIN));
    expect(send.mock.calls[0][0].attachments).toHaveLength(1);

    // …and says so when a deploy has wiped it.
    for (const f of madeFiles) await fs.promises.rm(f, { force: true });
    await events([blocked(await logs.findById(admissions._id).lean<any>())]);
    send.mockClear();
    await mail.retryDue(new Date(Date.now() + 3 * 60 * MIN));
    expect(send.mock.calls[0][0].attachments).toBeUndefined();
    expect(send.mock.calls[0][0].html).toContain('could not be attached again');
  });
});

describe('Contact form bots', () => {
  let app: INestApplication;
  let contacts: Model<any>;
  let logs: Model<any>;

  beforeAll(async () => {
    app = await bootApp();
    contacts = app.get(getModelToken(ContactUs.name));
    logs = app.get(getModelToken(MailLog.name));
  });
  afterAll(() => app.close());
  beforeEach(async () => {
    send.mockReset();
    send.mockResolvedValue([{ statusCode: 202, headers: {} }]);
    await Promise.all([contacts.deleteMany({}), logs.deleteMany({})]);
  });

  const form = {
    fullName: 'Mona Ahmed',
    email: 'mona.ahmed@gmail.com',
    phone: '01000000000',
    role: 'Parent',
    subject: 'admissions',
    message: 'I would like to know about the KG1 admission dates please.',
  };
  const post = (body: object) =>
    request(app.getHttpServer()).post('/contactus').send(body);

  it.each([
    ['fills the hidden field', { ...form, hp_check: 'http://spam.example', form_ms: 9000 }],
    ['sends within 3 seconds', { ...form, hp_check: '', form_ms: 800 }],
    ['posts straight to the API (no timer)', { ...form }],
  ])('ignores a bot that %s: same answer, nothing saved or sent', async (_n, body) => {
    const res = await post(body);
    expect(res.status).toBe(201);
    expect(res.body.fullName).toBe('Mona Ahmed');
    expect(await contacts.countDocuments()).toBe(0);
    expect(send).not.toHaveBeenCalled();
  });

  it('keeps and answers a real message, and records the email to Info@', async () => {
    const res = await post({ ...form, hp_check: '', form_ms: 42_000 });
    expect(res.status).toBe(201);
    const saved = await contacts.findOne().lean<any>();
    expect(saved.fullName).toBe('Mona Ahmed');
    expect(saved.hp_check).toBeUndefined();
    expect(saved.form_ms).toBeUndefined();
    expect(send).toHaveBeenCalledTimes(2);
    const log = await logs.findOne({ kind: 'contact' }).lean<any>();
    expect(log).toMatchObject({ refId: String(saved._id), retry: true, status: 'sent' });
    expect(log.to).toEqual(['Info@leadersintcollege.com']);
  });
});
