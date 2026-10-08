import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

// Stands in for every outgoing HTTP call made through Nest's HttpService
// (Paymob). Each test decides what it answers.
export const fakeHttp = {
  post: jest.fn(),
  get: jest.fn(),
};

export async function bootApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(HttpService)
    .useValue(fakeHttp)
    .compile();
  const app = moduleRef.createNestApplication();
  await app.init();

  // Start every file from an empty local test database.
  const db = app.get<Connection>(getConnectionToken());
  if (!['127.0.0.1', 'localhost'].includes(db.host)) {
    throw new Error(`Refusing to clear a non-local database (${db.host})`);
  }
  await db.dropDatabase();
  return app;
}

/** Signs in with the test HR login from setup-env.ts and returns the token. */
export async function adminToken(app: INestApplication): Promise<string> {
  // The server hashes its admin passwords right after it starts, so give it
  // a moment before the first sign-in.
  for (let i = 0; i < 50; i++) {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'hr@test.local', password: 'test-hr-password' });
    if (res.status === 201) return res.body.access_token;
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('Could not sign in with the test admin login');
}
