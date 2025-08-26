import { IsEmail, IsISO8601, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsOptional()
  @IsMongoId()
  applicationId?: string;

  @IsString()
  @IsEmail()
  parentEmail!: string;

  @IsISO8601()
  slotISO!: string;
}
