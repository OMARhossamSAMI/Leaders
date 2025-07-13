import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post()
  create(@Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.create(dto);
  }

  @Get()
  findAll() {
    return this.testimonialsService.findAllSortedByDate();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.testimonialsService.findByName(name);
  }

  @Put(':name')
  update(@Param('name') name: string, @Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.updateByName(name, dto);
  }

  @Delete(':name')
  delete(@Param('name') name: string) {
    return this.testimonialsService.deleteByName(name);
  }
}
