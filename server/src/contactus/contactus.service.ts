import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactUs, ContactUsDocument } from '../Schemas/contactus.schema';
import { CreateContactUsDto } from './dto/create-contactus.dto';
import { UpdateContactUsDto } from './dto/update-contactus.dto';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectModel(ContactUs.name)
    private contactUsModel: Model<ContactUsDocument>,
  ) {}

  async create(createDto: CreateContactUsDto): Promise<ContactUs> {
    const created = new this.contactUsModel(createDto);
    return created.save();
  }

  async findAll(): Promise<ContactUs[]> {
    return this.contactUsModel.find().sort({ createdAt: 1 }).exec();
  }

  async findOne(id: string): Promise<ContactUs | null> {
    return this.contactUsModel.findById(id);
  }
  async update(
    id: string,
    updateDto: UpdateContactUsDto,
  ): Promise<ContactUs | null> {
    return this.contactUsModel.findByIdAndUpdate(id, updateDto, { new: true });
  }

  async remove(id: string): Promise<any> {
    return this.contactUsModel.findByIdAndDelete(id);
  }
}
