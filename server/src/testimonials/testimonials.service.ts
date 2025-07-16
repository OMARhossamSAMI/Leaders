import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Testimonial,
  TestimonialDocument,
} from '../Schemas/testimonials.schema';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectModel(Testimonial.name)
    private readonly testimonialModel: Model<TestimonialDocument>,
  ) {}

  async create(dto: CreateTestimonialDto): Promise<Testimonial> {
    const testimonial = new this.testimonialModel(dto);
    return testimonial.save();
  }

  async findAllSortedByDate(): Promise<Testimonial[]> {
    return this.testimonialModel.find().sort({ dateCreated: -1 }).exec();
  }

  async findAllActiveSortedByDate(): Promise<Testimonial[]> {
    return this.testimonialModel
      .find({ on: true })
      .sort({ dateCreated: -1 })
      .exec();
  }

  async findById(id: string): Promise<Testimonial> {
  const testimonial = await this.testimonialModel.findById(id).exec();
  if (!testimonial) throw new NotFoundException('Testimonial not found');
  return testimonial;
}


  async updateById(
  id: string,
  dto: UpdateTestimonialDto,
): Promise<Testimonial> {
  const updated = await this.testimonialModel
    .findByIdAndUpdate(id, dto, { new: true })
    .exec();

  if (!updated) throw new NotFoundException('Testimonial not found');
  return updated;
}
async deleteById(id: string): Promise<{ message: string }> {
  const result = await this.testimonialModel.findByIdAndDelete(id).exec();
  if (!result) throw new NotFoundException('Testimonial not found');
  return { message: 'Testimonial deleted successfully' };
}
async updateVisibilityById(id: string, on: boolean): Promise<Testimonial> {
  const updated = await this.testimonialModel.findByIdAndUpdate(
    id,
    { on },
    { new: true },
  ).exec();

  if (!updated) throw new NotFoundException('Testimonial not found');
  return updated;
}


}
