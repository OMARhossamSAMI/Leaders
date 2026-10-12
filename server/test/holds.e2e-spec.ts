import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { of, throwError } from 'rxjs';
import * as request from 'supertest';
import * as sgMail from '@sendgrid/mail';
import { adminToken, bootApp, fakeHttp } from './app';
import { StudentApplication } from '../src/Schemas/studentApplication.schema';
import { Appointment } from '../src/Schemas/appointment.schema';
import { ClosedSlot } from '../src/Schemas/closedSlot.schema';
import { PaymentIssue, SlotHold } from '../src/Schemas/slotHold.schema';

const cairo = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Africa/Cairo',
  hour12: false,
  weekday: 'short',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});
const parts = (d: Date) =>
  Object.fromEntries(cairo.formatToParts(d).map((p) => [p.type, p.value]));

/** UTC ISO of Cairo date (today + daysAhead) at HH:MM, or null if that day is Fri/Sat. */
function slotIn(daysAhead: number, hhmm = '10:00', allowWeekend = false): string | null {
  const now = new Date();
  const base = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysAhead);
  for (let h = -4; h < 28; h++) {
    for (const m of [0, 30]) {
      const d = new Date(base + h * 3600_000 + m * 60_000);
      const p = parts(d);
      const today = parts(now);
      const target = new Date(Date.UTC(+today.year, +today.month - 1, +today.day + daysAhead));
      const want = target.toISOString().slice(0, 10);
      if (`${p.year}-${p.month}-${p.day}` === want && `${p.hour}:${p.minute}` === hhmm) {
        if (!allowWeekend && ['Fri', 'Sat'].includes(p.weekday)) return null;
        return d.toISOString();
      }
    }
  }
  return null;
}
const firstSchoolDay = (from: number, hhmm = '10:00') => {
  for (let k = from; k < from + 7; k++) {
    const s = slotIn(k, hhmm);
    if (s) return { k, slot: s };
  }
  throw new Error('no school day');
};
const cairoDate = (iso: string) => {
  const p = parts(new Date(iso));
  return `${p.year}-${p.month}-${p.day}`;
};

describe('Slot hold while paying', () => {
  let app: INestApplication;
  let apps: Model<any>;
  let appts: Model<any>;
  let holds: Model<any>;
  let issues: Model<any>;
  let closed: Model<any>;
  let intentions = 0;
  let intentionFails = false;
  let inquiry: any = null;
  let inquiryError: any = null;
  const DECLINED = 'https://leadersintcollege.com/admissions/appointments/Declined';
  const THANK_YOU = 'https://leadersintcollege.com/admissions/appointments/Thankyou';
  const RECEIVED = 'https://leadersintcollege.com/admissions/appointments/Received';
  const { slot } = firstSchoolDay(2);

  const http = () => request(app.getHttpServer());
  const pay = (code: string, slotISO = slot) =>
    http().post('/appointments/pay').send({ applicationId: code, slotISO });
  const freeTimes = async (slotISO = slot) =>
    (await http().get(`/appointments/available?date=${cairoDate(slotISO)}`)).body.times as string[];
  const tenOclockFree = async () => (await freeTimes()).includes('10:00');
  const callback = () => http().get('/appointments/callback?order=555');
  const paidTrx = (code: string, slotISO = slot, extra: Record<string, unknown> = {}) => ({
    success: true,
    pending: false,
    payment_key_claims: {
      extra: { appointmentCode: code, parentEmail: 'parent@test.local', slotISO, ...extra },
    },
  });

  async function newApp(code: string) {
    return apps.create({
      appointmentCode: code,
      data: { student_name: 'Child ' + code, father_name: 'Parent', father_email: 'parent@test.local', father_phone: '01000000000' },
    });
  }
  async function bookDirectly(slotISO = slot) {
    const a = await newApp('BOOKED-' + Math.random().toString(36).slice(2, 8));
    await appts.create({ applicationId: String(a._id), parentEmail: 'x@test.local', slotISO });
  }

  beforeAll(async () => {
    app = await bootApp();
    apps = app.get(getModelToken(StudentApplication.name));
    appts = app.get(getModelToken(Appointment.name));
    holds = app.get(getModelToken(SlotHold.name));
    issues = app.get(getModelToken(PaymentIssue.name));
    closed = app.get(getModelToken(ClosedSlot.name));
    await holds.syncIndexes();
    const token = await adminToken(app);
    await http().put('/settings/amount').set('Authorization', `Bearer ${token}`).send({ amount: 400000 });

    fakeHttp.post.mockImplementation((url: string) => {
      if (url.endsWith('/v1/intention/')) {
        intentions++;
        if (intentionFails) return throwError(() => ({ response: { status: 500 } }));
        return of({ data: { client_secret: 'cs_' + intentions } });
      }
      if (url.endsWith('/api/auth/tokens')) {
        if (inquiryError) return throwError(() => inquiryError);
        return of({ data: { token: 't' } });
      }
      if (url.endsWith('/transaction_inquiry')) return of({ data: inquiry });
      throw new Error('Unexpected call ' + url);
    });
  });
  afterAll(async () => {
    delete process.env.SLOT_HOLD_MINUTES;
    await app.close();
  });
  beforeEach(async () => {
    delete process.env.SLOT_HOLD_MINUTES;
    await Promise.all([appts.deleteMany({}), holds.deleteMany({}), issues.deleteMany({}), closed.deleteMany({}), apps.deleteMany({})]);
    intentions = 0;
    intentionFails = false;
    inquiry = null;
    inquiryError = null;
    (sgMail.send as jest.Mock).mockClear();
  });

  it('with holds off, payment start answers exactly as before and holds nothing', async () => {
    await newApp('OFF-1');
    const res = await pay('OFF-1');
    expect(res.status).toBe(201);
    expect(Object.keys(res.body)).toEqual(['checkout_url']);
    expect(await holds.countDocuments()).toBe(0);
    expect((await http().get('/appointments/hold/OFF-1')).body).toEqual({ hold: null });
  });

  it('holds the time for 20 minutes, hides it from others and blocks a second family', async () => {
    process.env.SLOT_HOLD_MINUTES = '20';
    await bookDirectly(); // 1 of 2 places already booked
    await newApp('FAM-A');
    await newApp('FAM-B');

    const a = await pay('FAM-A');
    expect(a.status).toBe(201);
    expect(a.body.slotISO).toBe(slot);
    const left = new Date(a.body.holdExpiresAt).getTime() - Date.now();
    expect(left).toBeGreaterThan(19 * 60_000);
    expect(left).toBeLessThanOrEqual(20 * 60_000);
    expect(await tenOclockFree()).toBe(false);

    const before = intentions;
    const b = await pay('FAM-B');
    expect(b.status).toBe(409);
    expect(b.body.message).toMatch(/just booked by another family/);
    expect(intentions).toBe(before); // no Paymob page for B

    const resume = (await http().get('/appointments/hold/FAM-A')).body.hold;
    expect(resume.slotISO).toBe(slot);
    expect(resume.checkoutUrl).toContain('clientSecret=cs_');
    expect((await http().get('/appointments/hold/FAM-B')).body.hold).toBeNull();

    // FAM-A chooses another time: the place is free again and FAM-B can take it.
    await http().post('/appointments/hold/FAM-A/release').expect(201);
    expect(await tenOclockFree()).toBe(true);
    expect((await pay('FAM-B')).status).toBe(201);
  });

  it('lets exactly one of 10 families take the last place at the same moment', async () => {
    process.env.SLOT_HOLD_MINUTES = '20';
    await bookDirectly();
    const codes = Array.from({ length: 10 }, (_, i) => 'RACE-' + i);
    for (const c of codes) await newApp(c);
    const results = await Promise.all(codes.map((c) => pay(c)));
    const statuses = results.map((r) => r.status).sort();
    expect(statuses.filter((s) => s === 201)).toHaveLength(1);
    expect(statuses.filter((s) => s === 409)).toHaveLength(9);
    expect(await holds.countDocuments()).toBe(1);
  });

  it('books a paid family with a live hold once, and removes the hold', async () => {
    process.env.SLOT_HOLD_MINUTES = '20';
    await bookDirectly();
    await newApp('PAID-1');
    expect((await pay('PAID-1')).status).toBe(201);
    inquiry = paidTrx('PAID-1');
    const res = await callback();
    expect(res.headers.location).toBe(THANK_YOU);
    expect(await appts.countDocuments({ slotISO: slot })).toBe(2);
    expect(await holds.countDocuments()).toBe(0);
    expect((await callback()).headers.location).toBe(THANK_YOU); // refresh: no double booking
    expect(await appts.countDocuments({ slotISO: slot })).toBe(2);
  });

  it('frees the time at once when the payment is declined', async () => {
    process.env.SLOT_HOLD_MINUTES = '20';
    await bookDirectly();
    await newApp('DECL-1');
    await pay('DECL-1');
    expect(await tenOclockFree()).toBe(false);
    inquiry = { ...paidTrx('DECL-1'), success: false };
    expect((await callback()).headers.location).toBe(DECLINED);
    expect(await tenOclockFree()).toBe(true);
    expect(await issues.countDocuments()).toBe(0);
  });

  it('an expired hold no longer blocks anyone', async () => {
    process.env.SLOT_HOLD_MINUTES = '20';
    await bookDirectly();
    await newApp('LATE');
    await pay('LATE');
    await holds.updateOne({ appointmentCode: 'LATE' }, { $set: { expiresAt: new Date(Date.now() - 1000) } });
    expect(await tenOclockFree()).toBe(true);
    expect((await http().get('/appointments/hold/LATE')).body.hold).toBeNull();
  });

  it('paid after the hold expired: booked if the time is still free', async () => {
    process.env.SLOT_HOLD_MINUTES = '20';
    await newApp('LATE-OK');
    await pay('LATE-OK');
    await holds.updateOne({}, { $set: { expiresAt: new Date(Date.now() - 1000) } });
    inquiry = paidTrx('LATE-OK');
    expect((await callback()).headers.location).toBe(THANK_YOU);
    expect(await appts.countDocuments({ slotISO: slot })).toBe(1);
  });

  it('paid after the hold expired and the time was taken: "Payment received", Admissions told, never "Declined"', async () => {
    process.env.SLOT_HOLD_MINUTES = '20';
    await bookDirectly();
    await newApp('SLOW');
    await newApp('FAST');
    await pay('SLOW');
    await holds.updateOne({ appointmentCode: 'SLOW' }, { $set: { expiresAt: new Date(Date.now() - 1000) } });
    expect((await pay('FAST')).status).toBe(201); // FAST now holds the last place
    inquiry = paidTrx('SLOW');
    const res = await callback();
    expect(res.headers.location).toBe(RECEIVED);
    expect(await appts.countDocuments({ slotISO: slot })).toBe(1);
    const issue = await issues.findOne().lean<any>();
    expect(issue).toMatchObject({ kind: 'paid-not-booked', orderId: '555', appointmentCode: 'SLOW' });
    const mails = (sgMail.send as jest.Mock).mock.calls.map((c) => c[0]);
    expect(mails.some((m) => m.to === 'Admission@leadersintcollege.com' && /follow-up/.test(m.subject))).toBe(true);
    await callback(); // a refresh doesn't record or email twice
    expect(await issues.countDocuments()).toBe(1);
  });

  it('Paymob unreachable: "we are confirming", not "Declined"; an unknown order stays a decline', async () => {
    inquiryError = { response: { status: 503 } };
    expect((await callback()).headers.location).toBe(RECEIVED + '?status=checking');
    expect(await issues.countDocuments({ kind: 'unconfirmed' })).toBe(1);
    inquiryError = { response: { status: 404 } };
    expect((await callback()).headers.location).toBe(DECLINED);
  });

  it('checks the time before any payment, with the same rules as the booking', async () => {
    await newApp('RULES');
    const friday = (() => { for (let k = 1; k < 8; k++) { const s = slotIn(k, '10:00', true); if (s && parts(new Date(s)).weekday === 'Fri') return s; } })()!;
    const r1 = await pay('RULES', friday);
    expect(r1.status).toBe(400);
    expect(r1.body.message).toMatch(/Friday or Saturday/);
    const tooFar = firstSchoolDay(15).slot;
    expect((await pay('RULES', tooFar)).body.message).toMatch(/outside the allowed scheduling window/);
    const early = firstSchoolDay(2, '08:30').slot;
    expect((await pay('RULES', early)).body.message).toMatch(/between 09:00 and 12:00/);
    await closed.create({ date: cairoDate(slot), time: '10:00' });
    expect((await pay('RULES', slot)).body.message).toMatch(/closed/);
    expect(intentions).toBe(0); // Paymob never opened
    // 14 days from today is still bookable (up to the end of that day)
    let lastDay: string | null = null;
    for (let k = 14; k >= 8 && !lastDay; k--) lastDay = slotIn(k, '12:00');
    expect((await pay('RULES', lastDay!)).status).toBe(201);
  });

  it('frees the hold if Paymob fails to start the payment', async () => {
    process.env.SLOT_HOLD_MINUTES = '20';
    await newApp('PMFAIL');
    intentionFails = true;
    const res = await pay('PMFAIL');
    expect(res.status).toBeGreaterThanOrEqual(500);
    expect(await holds.countDocuments()).toBe(0);
  });

  it('books older payments that carried the application id instead of the code', async () => {
    const a = await newApp('OLDFMT');
    inquiry = {
      success: true,
      pending: false,
      payment_key_claims: { extra: { applicationId: String(a._id), parentEmail: 'parent@test.local', slotISO: slot } },
    };
    expect((await callback()).headers.location).toBe(THANK_YOU);
    expect(await appts.countDocuments({ applicationId: String(a._id) })).toBe(1);
  });
});
