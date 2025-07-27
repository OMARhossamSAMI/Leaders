// ✅ ADD THIS FIRST
import 'reflect-metadata';

import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv'; // ✅ Load .env
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

console.log('✅ Loaded SENDGRID API KEY:', process.env.SENDGRID_API_KEY);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Serve /uploads manually
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.use(bodyParser.json({ limit: '2000mb' }));
  app.use(bodyParser.urlencoded({ limit: '2000mb', extended: true }));

  // ✅ Enable CORS for local frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://backend-leaders-production.up.railway.app',
    ], // add both ports if needed
    credentials: true, // if cookies or auth headers are used
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
