import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  Length,
} from 'class-validator';
import { IsEmailDomainReachable } from '../../common/validators/is-email-domain-reachable.validator';
import { IsRealText } from '../../common/validators/is-real-text.validator';

export class CreateContactUsDto {
  @IsString({ message: 'Please enter your full name.' })
  @IsNotEmpty({ message: 'Please enter your full name.' })
  @Length(2, 150, { message: 'Full name must be between 2 and 150 characters.' })
  fullName: string;

  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsEmailDomainReachable()
  email: string;

  @IsString({ message: 'Please enter your phone number.' })
  @IsNotEmpty({ message: 'Please enter your phone number.' })
  phone: string;

  @IsString({ message: 'Please select who you are.' })
  @IsNotEmpty({ message: 'Please select who you are.' })
  role: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsString({ message: 'Please select a subject.' })
  @IsNotEmpty({ message: 'Please select a subject.' })
  @Length(2, 150, { message: 'Subject must be between 2 and 150 characters.' })
  subject: string;

  @IsString({ message: 'Please enter your message.' })
  @Length(10, 3000, { message: 'Your message must be between 10 and 3000 characters.' })
  @IsRealText()
  message: string;
  @IsOptional()
  @IsBoolean()
  reviewed?: boolean; // ✅ Add this
}
