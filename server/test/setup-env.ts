// Runs before every e2e test file. It makes sure tests can only ever touch a
// local database and can never send a real email, WhatsApp message or payment.

// A local single-node replica set (bookings use transactions), one database
// per Jest worker so test files running in parallel don't collide.
const uri =
  process.env.MONGO_TEST_URI ??
  `mongodb://127.0.0.1:27018/leaders_website_test_${process.env.JEST_WORKER_ID ?? 0}?replicaSet=rs0`;

const host = uri.replace(/^mongodb:\/\/([^@/]*@)?/, '').split(/[/:?,]/)[0];
if (!['127.0.0.1', 'localhost'].includes(host)) {
  throw new Error(`Tests only run against a local database, not "${host}"`);
}

// Real environment variables win over the .env file, so these replace every
// secret the server would otherwise read from .env.
Object.assign(process.env, {
  MONGO_URI: uri,
  JWT_SECRET: 'test-jwt-secret-not-used-anywhere-else',
  JWT_EXPIRES_IN: '1h',
  HR_EMAIL: 'hr@test.local',
  HR_PASSWORD: 'test-hr-password',
  IT_EMAIL: 'it@test.local',
  IT_PASSWORD: 'test-it-password',
  ADMISSION_EMAIL: 'admission@test.local',
  ADMISSION_PASSWORD: 'test-admission-password',
  SENDGRID_API_KEY: 'SG.test',
  GMAIL_USER: 'test@test.local',
  GMAIL_PASS: 'test',
  Backend_URL: 'http://127.0.0.1:3999',
  PAYMOB_BASE: 'https://paymob.test',
  PAYMOB_API_KEY: 'test',
  PAYMOB_SECRET_KEY: 'test',
  PAYMOB_PUBLIC_KEY: 'test',
  PAYMOB_INTEGRATION_ID: '1',
  WHATSAPP_ACCESS_TOKEN: 'test',
  WHATSAPP_PHONE_NUMBER_ID: 'test',
  WHATSAPP_TOKEN: 'test',
  WA_TOKEN: 'test',
  WA_PHONE_NUMBER_ID: 'test',
  WA_VERIFY_TOKEN: 'test-verify',
});

// No real messages: email, SMTP and WhatsApp clients are replaced by mocks.
jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn().mockResolvedValue([{ statusCode: 202 }]),
}));
jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test' }),
    verify: jest.fn().mockResolvedValue(true),
  }),
}));
jest.mock('node-fetch', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({}),
    text: async () => '',
  }),
}));
