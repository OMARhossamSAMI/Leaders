import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { Testimonial } from 'src/Schemas/testimonials.schema';

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

  @Get('active')
async getActiveTestimonials(): Promise<Testimonial[]> {
  return this.testimonialsService.findAllActiveSortedByDate();
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

  @Patch('name/:name/toggle')
async toggleByName(
  @Param('name') name: string,
  @Body('on') on: boolean,
): Promise<Testimonial> {
  return this.testimonialsService.updateVisibilityByName(name, on);
}

}
