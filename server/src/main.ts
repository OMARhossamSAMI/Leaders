import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv'; // ✅ ADD THIS LINE
dotenv.config(); // ✅ Load .env before anything else
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

console.log('✅ Loaded SENDGRID API KEY:', process.env.SENDGRID_API_KEY);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Serve /uploads manually using express static
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Increase body size limit
  app.use(bodyParser.json({ limit: '2000mb' }));
  app.use(bodyParser.urlencoded({ limit: '2000mb', extended: true }));

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();