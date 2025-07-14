import { IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(['ACADEMIC', 'SPORTS', 'OTHER'])
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
