// src/testimonials/dto/create-testimonial.dto.ts
import { IsString } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  name: string;

  @IsString()
  role: string;

  @IsString()
  description: string;

  @IsString()
  profilePhoto: string;
}
