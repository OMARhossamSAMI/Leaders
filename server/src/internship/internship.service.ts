import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Internship, InternshipDocument } from '../Schemas/internship.schema';
import { Model } from 'mongoose';
import { CreateInternshipDto } from './dto/create-internship.dto';

@Injectable()
export class InternshipService {
  constructor(
    @InjectModel(Internship.name)
    private internshipModel: Model<InternshipDocument>,
  ) {}

  async create(createInternshipDto: CreateInternshipDto): Promise<Internship> {
    const created = new this.internshipModel(createInternshipDto);
    return created.save();
  }

  async findAll(): Promise<Internship[]> {
    return this.internshipModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Internship | null> {
    return this.internshipModel.findById(id).exec();
  }

  async delete(id: string): Promise<void> {
    await this.internshipModel.findByIdAndDelete(id);
  }
}