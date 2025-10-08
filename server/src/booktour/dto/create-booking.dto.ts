import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsMongoId()
  slotId!: string;

  @IsString()
  @IsNotEmpty()
  studentName!: string;

  @IsEmail()
  parentEmail!: string;

  @IsString()
  @IsNotEmpty()
  parentPhone!: string;

  @IsOptional()
  @IsString()
  selectedLabel?: string;

  @IsOptional()
  @IsString()
  gradeApplyingFor: string;
}
