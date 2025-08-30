// src/whatsapp/dto/wa-assessment.dto.ts
import { IsEmail, IsISO8601, IsMongoId, IsOptional, IsString } from 'class-validator';

export class WaAssessmentDto {
  @IsOptional()
  @IsEmail()
  parentEmail?: string;

  @IsOptional()
  @IsMongoId()
  applicationId?: string;

  // include if you send once-per-appointment logic
  @IsOptional()
  @IsMongoId()
  appointmentId?: string;

  @IsString()
  @IsISO8601()
  slotISO!: string;  // <-- MUST be named exactly "slotISO"
}
