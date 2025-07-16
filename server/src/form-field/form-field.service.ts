import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FormField, FormFieldDocument } from '../Schemas/form-field.schema';
import { Model } from 'mongoose';

@Injectable()
export class FormFieldService {
  constructor(
    @InjectModel(FormField.name) private fieldModel: Model<FormFieldDocument>
  ) {}

  findAll() {
    return this.fieldModel.find().sort({ createdAt: 1 }).exec();
  }

  create(field: Partial<FormField>) {
    return this.fieldModel.create(field);
  }

  update(id: string, data: Partial<FormField>) {
    return this.fieldModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  delete(id: string) {
    return this.fieldModel.findByIdAndDelete(id).exec();
  }

  async replaceAll(fields: FormField[]) {
  await this.fieldModel.deleteMany(); // clear old form
  return this.fieldModel.insertMany(fields); // insert all
}

}
