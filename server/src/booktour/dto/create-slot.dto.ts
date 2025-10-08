import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateSlotDto {
  @IsDateString()
  iso!: string; // "2025-09-03T11:00:00.000Z"

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  capacity?: number;
}
