import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Testimonial,
  TestimonialDocument,
} from '../Schemas/testimonials.schema';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';

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

  async findByName(name: string): Promise<Testimonial> {
    const testimonial = await this.testimonialModel.findOne({ name }).exec();
    if (!testimonial) throw new NotFoundException('Testimonial not found');
    return testimonial;
  }

  async updateByName(
    name: string,
    dto: CreateTestimonialDto,
  ): Promise<Testimonial> {
    const updated = await this.testimonialModel
      .findOneAndUpdate({ name }, dto, { new: true })
      .exec();

    if (!updated) throw new NotFoundException('Testimonial not found');
    return updated;
  }

  async deleteByName(name: string): Promise<{ message: string }> {
    const result = await this.testimonialModel
      .findOneAndDelete({ name })
      .exec();
    if (!result) throw new NotFoundException('Testimonial not found');
    return { message: 'Testimonial deleted successfully' };
  }



  async updateVisibilityByName(name: string, on: boolean): Promise<Testimonial> {
  const updated = await this.testimonialModel.findOneAndUpdate(
    { name },
    { on },
    { new: true }
  );
  if (!updated) throw new NotFoundException('Testimonial not found');
  return updated;
}

}
