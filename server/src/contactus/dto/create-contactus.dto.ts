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
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  fullName: string;

  @IsEmail()
  @IsEmailDomainReachable()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  subject: string;

  @IsString()
  @Length(10, 3000)
  @IsRealText()
  message: string;
  @IsOptional()
  @IsBoolean()
  reviewed?: boolean; // ✅ Add this
}
