import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  EmploymentFormField,
  EmploymentFormFieldDocument,
} from '../Schemas/employment-form-field.schema';
import { Model } from 'mongoose';

@Injectable()
export class EmploymentFormFieldsService {
  constructor(
    @InjectModel(EmploymentFormField.name)
    private fieldModel: Model<EmploymentFormFieldDocument>,
  ) {}

  async findAll(): Promise<EmploymentFormField[]> {
    return this.fieldModel.find().sort({ order: 1 }).exec();
  }

  async replaceAll(fields: EmploymentFormField[]): Promise<EmploymentFormField[]> {
  try {
    await this.fieldModel.deleteMany({});

    const orderedFields = fields.map((field, index) => ({
      ...field,
      order: index,
    }));

    return await this.fieldModel.insertMany(orderedFields);
  } catch (error) {
    console.error("Error inserting fields:", error); // ✅ log actual reason
    throw new InternalServerErrorException('Failed to replace fields');
  }
}


  async create(field: EmploymentFormField): Promise<EmploymentFormField> {
    return new this.fieldModel(field).save();
  }

  async deleteAll(): Promise<void> {
    await this.fieldModel.deleteMany({});
  }
}
