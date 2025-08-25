import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';   // ⬅️ add this
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

console.log('✅ Loaded SENDGRID API KEY:', process.env.SENDGRID_API_KEY);

async function bootstrap() {
  // ⬇️ create an EXPRESS app explicitly
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Serve uploads
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.use('/static',  express.static(join(__dirname, '..', 'public'))); // ⬅️ add this

  app.use(bodyParser.json({ limit: '2000mb' }));
  app.use(bodyParser.urlencoded({ limit: '2000mb', extended: true }));

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://leaderscollege.up.railway.app',
      'https://leaders-frontend.onrender.com',
      'https://www.leadersintcollege.com',
      'https://leadersintcollege.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // optional global validation
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = Number(process.env.PORT) || 3000;  // ⬅️ fallback for local dev
  await app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });
}
bootstrap();
