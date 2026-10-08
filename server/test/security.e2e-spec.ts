import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { adminToken, bootApp } from './app';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type Route = { method: Method; path: string; url?: string; body?: object };

const ID = '64b000000000000000000000';

// Every route the public website, Paymob or Meta call. They must keep working
// without a login.
const PUBLIC: Route[] = [
  { method: 'GET', path: '/' },
  {
    method: 'POST',
    path: '/auth/login',
    body: { email: 'hr@test.local', password: 'test-hr-password' },
  },
  { method: 'GET', path: '/settings' },
  { method: 'GET', path: '/settings/show-events' },
  { method: 'GET', path: '/settings/show-appointments' },
  { method: 'GET', path: '/settings/amount' },
  { method: 'GET', path: '/settings/admission-closed' },
  { method: 'GET', path: '/form-fields' },
  { method: 'GET', path: '/employment-form-fields' },
  { method: 'GET', path: '/jobs' },
  { method: 'GET', path: '/events' },
  { method: 'GET', path: '/events/visible' },
  { method: 'GET', path: '/events/notice' },
  { method: 'GET', path: '/events/:title' },
  { method: 'GET', path: '/testimonials' },
  { method: 'GET', path: '/testimonials/active' },
  { method: 'GET', path: '/testimonials/:id' },
  { method: 'GET', path: '/popup' },
  { method: 'GET', path: '/popup/:id' },
  { method: 'GET', path: '/popup/live/only' },
  { method: 'GET', path: '/booktour/admin/ping' },
  { method: 'GET', path: '/booktour/admin/slots', url: '/booktour/admin/slots?active=true' },
  { method: 'GET', path: '/booktour/slots/active' },
  { method: 'POST', path: '/booktour/bookings', body: {} },
  { method: 'GET', path: '/appointments/closed' },
  { method: 'GET', path: '/appointments/for-date', url: '/appointments/for-date?date=2030-01-06' },
  { method: 'GET', path: '/appointments/available', url: '/appointments/available?date=2030-01-06' },
  { method: 'GET', path: '/appointments/available-for-date', url: '/appointments/available-for-date?date=2030-01-06' },
  { method: 'GET', path: '/appointments/test-conversion', url: '/appointments/test-conversion?slotISO=2030-01-06T08:00:00.000Z' },
  { method: 'POST', path: '/appointments/pay', body: {} },
  { method: 'GET', path: '/appointments/callback' },
  { method: 'GET', path: '/appointments/webhook', url: '/appointments/webhook?hub.mode=subscribe&hub.verify_token=test-verify&hub.challenge=42' },
  { method: 'POST', path: '/appointments/webhook', body: {} },
  { method: 'GET', path: '/wa', url: '/wa?hub.mode=subscribe&hub.verify_token=test-verify&hub.challenge=42' },
  { method: 'POST', path: '/wa', body: {} },
  { method: 'POST', path: '/applications', body: {} },
  { method: 'GET', path: '/applications/by-id/:id', url: '/applications/by-id/NO-SUCH-CODE' },
  { method: 'POST', path: '/contactus', body: {} },
  { method: 'POST', path: '/vacancy', body: {} },
  { method: 'POST', path: '/internship', body: {} },
];

// Every route the admin pages use, and the ones nobody outside should call.
const ADMIN: Route[] = [
  { method: 'GET', path: '/applications' },
  { method: 'GET', path: '/applications/by-parent-email', url: '/applications/by-parent-email?email=a@b.c' },
  { method: 'GET', path: '/applications/unbooked' },
  { method: 'GET', path: '/applications/:id' },
  { method: 'PATCH', path: '/applications/:id', body: {} },
  { method: 'DELETE', path: '/applications/:id' },
  { method: 'GET', path: '/appointments' },
  { method: 'GET', path: '/appointments/all' },
  { method: 'GET', path: '/appointments/admin-list' },
  { method: 'POST', path: '/appointments', body: {} },
  { method: 'DELETE', path: '/appointments/:id' },
  { method: 'POST', path: '/appointments/closed', body: {} },
  { method: 'DELETE', path: '/appointments/closed', body: {} },
  { method: 'GET', path: '/vacancy' },
  { method: 'GET', path: '/vacancy/export' },
  { method: 'PATCH', path: '/vacancy/:id', body: {} },
  { method: 'DELETE', path: '/vacancy/:id' },
  { method: 'GET', path: '/internship' },
  { method: 'GET', path: '/internship/export' },
  { method: 'GET', path: '/internship/:id' },
  { method: 'DELETE', path: '/internship/:id' },
  { method: 'GET', path: '/contactus' },
  { method: 'GET', path: '/contactus/:id' },
  { method: 'PATCH', path: '/contactus/:id/reviewed' },
  { method: 'DELETE', path: '/contactus/:id' },
  { method: 'POST', path: '/booktour/admin/slots', body: {} },
  { method: 'PATCH', path: '/booktour/admin/slots/:id', body: {} },
  { method: 'DELETE', path: '/booktour/admin/slots/:id' },
  { method: 'GET', path: '/booktour/admin/slots/:id/bookings' },
  { method: 'GET', path: '/booktour/admin/bookings' },
  { method: 'DELETE', path: '/booktour/admin/bookings/:id' },
  { method: 'POST', path: '/accepted-student/:id/accept' },
  { method: 'GET', path: '/accepted-student' },
  { method: 'DELETE', path: '/accepted-student/:id' },
  { method: 'POST', path: '/accepted-student/:id/send-assessment', body: {} },
  { method: 'GET', path: '/wa/health' },
  { method: 'POST', path: '/wa/assessment-confirmation', body: {} },
  { method: 'POST', path: '/wa/custom', body: {} },
  { method: 'PUT', path: '/settings/show-events', body: {} },
  { method: 'PUT', path: '/settings/show-appointments', body: {} },
  { method: 'PUT', path: '/settings/amount', body: {} },
  { method: 'PUT', path: '/settings/admission-closed', body: {} },
  { method: 'POST', path: '/popup', body: {} },
  { method: 'PUT', path: '/popup/:id', body: {} },
  { method: 'DELETE', path: '/popup/:id' },
  { method: 'PATCH', path: '/popup/toggle/:id' },
  { method: 'POST', path: '/testimonials', body: {} },
  { method: 'PATCH', path: '/testimonials/:id', body: {} },
  { method: 'DELETE', path: '/testimonials/:id' },
  { method: 'PATCH', path: '/testimonials/id/:id/toggle' },
  { method: 'POST', path: '/events', body: {} },
  { method: 'PUT', path: '/events/:title', body: {} },
  { method: 'DELETE', path: '/events/:title' },
  { method: 'POST', path: '/jobs', body: {} },
  { method: 'DELETE', path: '/jobs/:id' },
  { method: 'POST', path: '/form-fields', body: {} },
  { method: 'PATCH', path: '/form-fields/:id', body: {} },
  { method: 'DELETE', path: '/form-fields/:id' },
  { method: 'PUT', path: '/form-fields', body: {} },
  { method: 'PUT', path: '/employment-form-fields', body: [] },
  { method: 'POST', path: '/employment-form-fields', body: {} },
  { method: 'DELETE', path: '/employment-form-fields' },
];

const urlOf = (r: Route) =>
  r.url ?? r.path.replace(':id', ID).replace(':title', 'no-such-event');

function call(app: INestApplication, r: Route, token?: string) {
  const agent = request(app.getHttpServer());
  const verb = r.method.toLowerCase() as 'get';
  let req = agent[verb](urlOf(r));
  if (token) req = req.set('Authorization', `Bearer ${token}`);
  if (r.body !== undefined) req = req.send(r.body);
  return req;
}

describe('Admin login on the server', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    app = await bootApp();
    token = await adminToken(app);
  });
  afterAll(async () => {
    await app.close();
  });

  it('lists every route the server has (nothing is left unchecked)', () => {
    const instance = app.getHttpAdapter().getInstance();
    const router = instance.router ?? instance._router;
    const live = new Set<string>();
    for (const layer of router.stack) {
      if (!layer.route) continue;
      for (const m of Object.keys(layer.route.methods)) {
        if (m === '_all') continue;
        live.add(`${m.toUpperCase()} ${layer.route.path}`);
      }
    }
    const listed = new Set(
      [...PUBLIC, ...ADMIN].map((r) => `${r.method} ${r.path}`),
    );
    expect([...live].filter((x) => !listed.has(x)).sort()).toEqual([]);
    expect([...listed].filter((x) => !live.has(x)).sort()).toEqual([]);
  });

  it.each(PUBLIC.map((r) => [`${r.method} ${r.path}`, r] as const))(
    'public: %s works without a login',
    async (_name, r) => {
      const res = await call(app, r);
      expect([401, 403]).not.toContain(res.status);
    },
  );

  it.each(ADMIN.map((r) => [`${r.method} ${r.path}`, r] as const))(
    'admin: %s needs a login',
    async (_name, r) => {
      const res = await call(app, r);
      expect(res.status).toBe(401);
    },
  );

  it.each(ADMIN.map((r) => [`${r.method} ${r.path}`, r] as const))(
    'admin: %s works when signed in',
    async (_name, r) => {
      const res = await call(app, r, token);
      expect([401, 403]).not.toContain(res.status);
    },
  );

  it('refuses an expired token', async () => {
    const expired = jwt.sign(
      {
        email: 'hr@test.local',
        role: 'hr',
        exp: Math.floor(Date.now() / 1000) - 60,
      },
      process.env.JWT_SECRET!,
    );
    const res = await call(app, { method: 'GET', path: '/applications' }, expired);
    expect(res.status).toBe(401);
  });

  it('refuses a token signed with another secret', async () => {
    const forged = jwt.sign({ email: 'x@y.z', role: 'hr' }, 'guessed-secret');
    const res = await call(app, { method: 'GET', path: '/applications' }, forged);
    expect(res.status).toBe(401);
  });

  it('refuses a wrong password at sign-in', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'hr@test.local', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('answers the Meta webhook check exactly as before', async () => {
    const r = PUBLIC.find((x) => x.path === '/appointments/webhook')!;
    const res = await call(app, r);
    expect(res.status).toBe(200);
    expect(res.text).toBe('42');
  });
});
