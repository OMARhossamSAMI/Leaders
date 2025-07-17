import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vacancy } from '../Schemas/vacancy.schema';
import { CreateVacancyDto } from './dto/create-vacancy.dto';

@Injectable()
export class VacancyService {
  constructor(
    @InjectModel('Vacancy') private readonly vacancyModel: Model<Vacancy>,
  ) {}

  async create(createVacancyDto: CreateVacancyDto): Promise<Vacancy> {
  const created = new this.vacancyModel(createVacancyDto);
  return created.save();
}

async findAll() {
  return this.vacancyModel.find().sort({ createdAt: -1 });
}

async update(id: string, newData: Record<string, any>) {
  return this.vacancyModel.findByIdAndUpdate(id, { data: newData }, { new: true });
}

async delete(id: string) {
  return this.vacancyModel.findByIdAndDelete(id);
}

}
