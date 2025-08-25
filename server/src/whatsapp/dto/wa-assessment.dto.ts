// dto/wa-assessment.dto.ts
import { IsEmail, IsISO8601, IsMongoId, ValidateIf } from 'class-validator';

export class WaAssessmentDto {
  // Require email only when applicationId is missing
  @ValidateIf(o => !o.applicationId)
  @IsEmail()
  parentEmail!: string;

  // Require applicationId only when email is missing
  @ValidateIf(o => !o.parentEmail)
  @IsMongoId()
  applicationId?: string;

  // strict ISO8601 validation
  @IsISO8601({ strict: true })
  slotISO!: string;
}
