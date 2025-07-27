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

  // ✅ TEMP: Universal CORS handling for Railway (add this first)
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204); // Respond to preflight
    }
    next();
  });

  // ✅ Optionally keep this if you want fine control later
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://backend-leaders-production.up.railway.app',
    ],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  });
}
bootstrap();
