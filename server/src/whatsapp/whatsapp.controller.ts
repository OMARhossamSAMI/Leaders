// src/whatsapp/whatsapp.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Logger,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { WhatsappService } from './whatsapp.service';
import { WaAssessmentDto } from './dto/wa-assessment.dto';

@Controller('wa')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);

  constructor(private readonly svc: WhatsappService) {}

  // --- helper to avoid leaking long tokens in logs
  private redactEnv(v?: string | null) {
    if (!v) return false;
    return typeof v === 'string' && v.length > 8
      ? `${v.slice(0, 4)}…${v.slice(-4)}`
      : v;
  }

  /**
   * Simple readiness/debug endpoint (no secrets).
   */
  @Get('health')
  @HttpCode(200)
  health() {
    const token = process.env.WHATSAPP_TOKEN ?? process.env.WA_TOKEN;
    const phoneId =
      process.env.WHATSAPP_PHONE_NUMBER_ID ?? process.env.WA_PHONE_NUMBER_ID;

    return {
      ok: true,
      phoneIdSet: !!phoneId,
      templateName: process.env.WA_TEMPLATE_NAME ?? 'assessment_confirmation',
      templateLang: process.env.WA_TEMPLATE_LANG ?? 'en_US',
      templateParamCount: Number(process.env.WA_TEMPLATE_PARAM_COUNT ?? '2'),
      hasHeaderImage: !!process.env.POLAROID_IMAGE_URL,
      surveyUrl: !!process.env.DEFAULT_SURVEY_URL,
      sample: {
        phoneId: this.redactEnv(phoneId || ''),
        token: this.redactEnv(token || ''),
      },
    };
  }

  /**
   * WhatsApp Webhook verification (GET).
   * Meta sends hub.mode, hub.verify_token, hub.challenge.
   * You MUST echo hub.challenge on success.
   *
   * Callback URL you configure in WhatsApp Manager:
   *   https://<your-public-host>/wa/webhook
   */
  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const expected =
      process.env.WA_WEBHOOK_VERIFY ?? process.env.WEBHOOK_VERIFY_TOKEN;

    if (mode === 'subscribe' && token && token === expected) {
      // MUST return the challenge verbatim with 200 OK
      return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
  }

  /**
   * WhatsApp Webhook receiver (POST).
   * Handle message/status notifications here. Always return 200 quickly.
   */
  @Post('webhook')
  @HttpCode(200)
  receiveWebhook(@Body() body: any) {
    this.logger.debug(`[WA WEBHOOK] ${JSON.stringify(body)}`);
    // TODO: add your business logic (message/status handling) here if needed
    return { received: true };
  }

  /**
   * Sends the assessment confirmation message (template or free text).
   */
  @Post('assessment-confirmation')
  @HttpCode(202)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async sendAssessment(@Body() dto: WaAssessmentDto) {
    this.logger.log(
      `[IN] POST /wa/assessment-confirmation body=${JSON.stringify(dto)}`,
    );

    // quick guard for obviously bad dates
    if (!dto?.slotISO || isNaN(new Date(dto.slotISO).getTime())) {
      throw new BadRequestException('slotISO must be a valid ISO datetime.');
    }

    try {
      const result = await this.svc.sendAssessment(dto);
      this.logger.log(`[OUT] result=${JSON.stringify(result)}`);
      return result; // { ok: true, sent: [...] }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Unknown error in WA controller';
      const stack = err instanceof Error ? err.stack : undefined;

      if (err instanceof HttpException) {
        this.logger.error(`[ERR] sendAssessment -> ${msg}`, stack);
        throw err;
      }

      this.logger.error(`[ERR] sendAssessment -> ${msg}`, stack);
      throw new BadRequestException(msg);
    }
  }
}
