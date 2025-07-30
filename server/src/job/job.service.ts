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

    // 🔎 Normalize academicYear to "YY/YY" format
    if (academicYear.includes('20')) {
      const normalized = academicYear.replace(/\s+/g, ''); // "2025/2026"
      academicYear = normalized.slice(2, 4) + '/' + normalized.slice(6, 8); // "25/26"
      console.log('🔧 Normalized academicYear to:', academicYear);
    }

    const [shortStart, shortEnd] = academicYear.split('/');
    const startYear = 2000 + parseInt(shortStart);
    const endYear = 2000 + parseInt(shortEnd);

    // 🔐 Validate the parsed years
    if (
      isNaN(startYear) ||
      isNaN(endYear) ||
      startYear >= endYear ||
      startYear < 2000 ||
      endYear > 2100
    ) {
      console.error('❌ Invalid academic year format or range:', academicYear);
      throw new Error('Invalid academic year format.');
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
