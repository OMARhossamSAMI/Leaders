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
    console.log('📩 Received Job DTO:', createJobDto);

    let { academicYear } = createJobDto;

    // Log before normalization
    console.log('🔎 Raw academicYear value:', academicYear);

    // Normalize academicYear if it's in format like "2025 / 2026"
    if (academicYear.includes('20')) {
      const normalized = academicYear.replace(/\s+/g, '');
      academicYear = normalized.slice(2, 4) + '/' + normalized.slice(6, 8);
      console.log('🔧 Normalized academicYear to:', academicYear);
    }

    let startYear: number;
    let endYear: number;

    if (academicYear === '25/26') {
      startYear = 2025;
      endYear = 2026;
    } else if (academicYear === '26/27') {
      startYear = 2026;
      endYear = 2027;
    } else {
      console.error('❌ Invalid academic year provided:', academicYear);
      throw new Error('Invalid academic year provided.');
    }

    const job = new this.jobModel({
      ...createJobDto,
      academicYear,
      startYear,
      endYear,
    });

    console.log('✅ Job prepared for saving:', job);
    return job.save();
  }

  async deleteJob(id: string) {
    return this.jobModel.findByIdAndDelete(id);
  }
}
