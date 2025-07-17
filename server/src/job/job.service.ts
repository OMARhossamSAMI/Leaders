import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from '../Schemas/job.schema';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobService {
  constructor(@InjectModel(Job.name) private jobModel: Model<Job>) {}

  async findAll() {
    return this.jobModel.find().sort({ createdAt: -1 });
  }

  async create(createJobDto: CreateJobDto) {
    const job = new this.jobModel(createJobDto);
    return job.save();
  }

  async deleteJob(id: string) {
  return this.jobModel.findByIdAndDelete(id);
}



}
