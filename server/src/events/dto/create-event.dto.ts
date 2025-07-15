import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsDateString()
  date: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsEnum(['on', 'off'])
  status?: string;
}
