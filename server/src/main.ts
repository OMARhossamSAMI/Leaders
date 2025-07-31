import 'reflect-metadata';

import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv'; // ✅ Load .env
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

console.log('✅ Loaded SENDGRID API KEY:', process.env.SENDGRID_API_KEY);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Serve /uploads manually
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.use(bodyParser.json({ limit: '2000mb' }));
  app.use(bodyParser.urlencoded({ limit: '2000mb', extended: true }));

  // ✅ Optionally keep this if you want fine control later
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://leaderscollege.up.railway.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT!;
  await app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });
}
bootstrap();
