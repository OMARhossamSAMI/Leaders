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
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

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


  @Get(':id')
getById(@Param('id') id: string) {
  return this.testimonialsService.findById(id);
}


  @Patch(':id')
update(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
  return this.testimonialsService.updateById(id, dto);
}

@Delete(':id')
delete(@Param('id') id: string) {
  return this.testimonialsService.deleteById(id);
}

@Patch('id/:id/toggle')
toggle(@Param('id') id: string, @Body('on') on: boolean) {
  return this.testimonialsService.updateVisibilityById(id, on);
}


}
