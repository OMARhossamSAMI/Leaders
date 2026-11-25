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
import { getConnectionToken } from '@nestjs/mongoose';
import { restoreUploads } from './common/restore-uploads';

console.log('✅ SendGrid API key loaded:', !!process.env.SENDGRID_API_KEY);

async function bootstrap() {
  // ⬇️ create an EXPRESS app explicitly
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    rawBody: true,
  });

  // Serve uploads
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.use('/static',  express.static(join(__dirname, '..', 'public'))); // ⬅️ add this

  // Keep the raw bytes too: SendGrid's webhook signature is checked on them.
  app.use(
    bodyParser.json({
      limit: '2000mb',
      verify: (req: any, _res, buf: Buffer) => {
        req.rawBody = buf;
      },
    }),
  );
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

  // On Render a deploy starts without the uploaded files. Copy the missing
  // ones from the old server, which answers until this one opens its port.
  // RENDER_EXTERNAL_URL is set by Render only, so this never runs locally.
  const restoreFrom =
    process.env.UPLOADS_RESTORE_FROM || process.env.RENDER_EXTERNAL_URL;
  if (restoreFrom && process.env.UPLOADS_RESTORE !== 'off') {
    try {
      await restoreUploads({
        db: app.get(getConnectionToken()),
        dir: join(__dirname, '..', 'uploads'),
        baseUrl: restoreFrom,
      });
    } catch (err) {
      console.error('⚠️ Could not restore uploads:', err);
    }
  }

  const port = Number(process.env.PORT) || 3000;  // ⬅️ fallback for local dev
  await app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });
}
bootstrap();
