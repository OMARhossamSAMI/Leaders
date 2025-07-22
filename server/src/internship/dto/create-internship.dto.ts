export class CreateInternshipDto {
  full_name: string;
  email: string;
  phone: string;
  university: string;
  degree: string;
  year_of_study: number;
  start_date: Date;
  duration: string;
  motivation?: string;
  cv_file_url?: string;
  cover_letter_url?: string;
}
