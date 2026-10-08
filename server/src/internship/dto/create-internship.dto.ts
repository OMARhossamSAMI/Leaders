import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsInt,
  Min,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsEmailDomainReachable } from '../../common/validators/is-email-domain-reachable.validator';
import { IsRealText } from '../../common/validators/is-real-text.validator';

export class CreateInternshipDto {
  @IsString({ message: 'Please enter your full name.' })
  @IsNotEmpty({ message: 'Please enter your full name.' })
  full_name: string;

  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsEmailDomainReachable()
  email: string;

  @IsString({ message: 'Please enter your phone number.' })
  @IsNotEmpty({ message: 'Please enter your phone number.' })
  phone: string;

  @IsString({ message: 'Please enter your university name.' })
  @IsNotEmpty({ message: 'Please enter your university name.' })
  university: string;

  @IsString({ message: 'Please enter your degree or program.' })
  @IsNotEmpty({ message: 'Please enter your degree or program.' })
  degree: string;

  @Type(() => Number)
  @IsInt({ message: 'Please enter a valid year of study.' })
  @Min(1, { message: 'Year of study must be at least 1.' })
  year_of_study: number;

  @Type(() => Date)
  @IsDate({ message: 'Please enter a valid preferred start date.' })
  start_date: Date;

  @IsString({ message: 'Please enter your preferred internship duration.' })
  @IsNotEmpty({ message: 'Please enter your preferred internship duration.' })
  duration: string;

  @IsString({ message: 'Please enter your desired position.' })
  @IsNotEmpty({ message: 'Please enter your desired position.' })
  desired_position: string;

  @IsOptional()
  @IsString({ message: 'Please enter your motivation as text.' })
  @IsRealText({ message: 'Please enter a real motivation statement.' })
  motivation?: string;

  @IsOptional()
  @IsString()
  cv_file_url?: string;

  @IsOptional()
  @IsString()
  cover_letter_url?: string;
}
