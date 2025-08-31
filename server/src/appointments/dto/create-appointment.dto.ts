import {
  IsEmail,
  IsISO8601,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsOptional()
  @IsMongoId()
  applicationId?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  parentEmail!: string;

  @IsISO8601()
  slotISO!: string;
}
