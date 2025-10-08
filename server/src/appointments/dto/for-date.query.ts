import { IsDateString } from 'class-validator';

export class ForDateQuery {
  /** YYYY-MM-DD (local date assumed; we map to UTC day range) */
  @IsDateString()
  date: string;
}
