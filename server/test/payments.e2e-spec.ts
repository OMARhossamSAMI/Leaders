import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { of } from 'rxjs';
import * as request from 'supertest';
import { bootApp, fakeHttp } from './app';
import {
  firstTransaction,
  isPaidTransaction,
} from '../src/appointments/paymob';
import { StudentApplication } from '../src/Schemas/studentApplication.schema';
import { Appointment } from '../src/Schemas/appointment.schema';

describe('isPaidTransaction', () => {
  it('accepts a successful payment', () => {
    expect(isPaidTransaction({ success: true, pending: false })).toBe(true);
  });
  it('refuses a declined card (not pending, but not successful)', () => {
    expect(isPaidTransaction({ success: false, pending: false })).toBe(false);
  });
  it('refuses a payment that is still pending', () => {
    expect(isPaidTransaction({ success: false, pending: true })).toBe(false);
    expect(isPaidTransaction({ success: true, pending: true })).toBe(false);
  });
  it('refuses voided and refunded payments', () => {
    expect(
      isPaidTransaction({ success: true, pending: false, is_voided: true }),
    ).toBe(false);
    expect(
      isPaidTransaction({ success: true, pending: false, is_refunded: true }),
    ).toBe(false);
  });
  it('refuses an empty answer', () => {
    expect(isPaidTransaction(undefined)).toBe(false);
    expect(isPaidTransaction({})).toBe(false);
  });
  it('reads the first transaction when Paymob answers with a list', () => {
    const trx = { success: true, pending: false };
    expect(firstTransaction([trx])).toBe(trx);
    expect(firstTransaction(trx)).toBe(trx);
  });
});

/** The next Sunday–Thursday at 10:00 Cairo time, as a UTC ISO string. */
function nextSchoolDaySlot(): string {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Cairo',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const now = new Date();
  for (let day = 1; day <= 7; day++) {
    for (let h = 0; h < 24; h++) {
      const d = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + day, h),
      );
      const parts = Object.fromEntries(
        fmt.formatToParts(d).map((p) => [p.type, p.value]),
      );
      if (
        parts.hour === '10' &&
        parts.minute === '00' &&
        !['Fri', 'Sat'].includes(parts.weekday)
      ) {
        return d.toISOString();
      }
    }
  }
  throw new Error('No school day found');
}

describe('Paymob payment callback', () => {
  let app: INestApplication;
  let applications: Model<any>;
  let appointments: Model<any>;
  const code = 'TEST-CODE-1';
  const slotISO = nextSchoolDaySlot();
  let transaction: any;

  const DECLINED = 'https://leadersintcollege.com/admissions/appointments/Declined';
  const THANK_YOU = 'https://leadersintcollege.com/admissions/appointments/Thankyou';

  beforeAll(async () => {
    app = await bootApp();
    applications = app.get(getModelToken(StudentApplication.name));
    appointments = app.get(getModelToken(Appointment.name));
    await applications.create({
      appointmentCode: code,
      data: {
        student_name: 'Test Student',
        father_name: 'Test Parent',
        father_email: 'parent@test.local',
      },
    });

    // Paymob: sign-in, then the transaction inquiry answers `transaction`.
    fakeHttp.post.mockImplementation((url: string) => {
      if (url.endsWith('/api/auth/tokens')) return of({ data: { token: 't' } });
      if (url.endsWith('/transaction_inquiry')) return of({ data: transaction });
      throw new Error(`Unexpected call to ${url}`);
    });
  });
  afterAll(async () => {
    await app.close();
  });

  const extra = () => ({
    appointmentCode: code,
    parentEmail: 'parent@test.local',
    slotISO,
  });
  const callback = (query = '?order=123') =>
    request(app.getHttpServer()).get(`/appointments/callback${query}`);

  it('sends a missing order to the Declined page on the live site', async () => {
    const res = await callback('');
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(DECLINED);
  });

  it('does not book anything for a declined card', async () => {
    transaction = {
      success: false,
      pending: false,
      payment_key_claims: { extra: extra() },
    };
    const res = await callback();
    expect(res.headers.location).toBe(DECLINED);
    expect(await appointments.countDocuments()).toBe(0);
  });

  it('does not book anything while the payment is pending', async () => {
    transaction = {
      success: false,
      pending: true,
      payment_key_claims: { extra: extra() },
    };
    const res = await callback();
    expect(res.headers.location).toBe(DECLINED);
    expect(await appointments.countDocuments()).toBe(0);
  });

  it('books the slot once for a successful payment', async () => {
    transaction = {
      success: true,
      pending: false,
      payment_key_claims: { extra: extra() },
    };
    const res = await callback();
    expect(res.headers.location).toBe(THANK_YOU);
    expect(await appointments.countDocuments()).toBe(1);
    const appDoc = await applications.findOne({ appointmentCode: code }).lean<any>();
    expect(appDoc.hasBookedAppointment).toBe(true);
  });

  it('does not book twice when the same payment link is opened again', async () => {
    const res = await callback();
    expect(res.headers.location).toBe(THANK_YOU);
    expect(await appointments.countDocuments()).toBe(1);
  });

  it('still books when Paymob answers with a list', async () => {
    await appointments.deleteMany({});
    transaction = [
      { success: true, pending: false, payment_key_claims: { extra: extra() } },
    ];
    const res = await callback();
    expect(res.headers.location).toBe(THANK_YOU);
    expect(await appointments.countDocuments()).toBe(1);
  });

  it('no longer lets anyone book without paying', async () => {
    const res = await request(app.getHttpServer())
      .post('/appointments')
      .send({ applicationId: code, parentEmail: 'parent@test.local', slotISO });
    expect(res.status).toBe(401);
  });
});
