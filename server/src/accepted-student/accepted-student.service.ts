import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AcceptedStudent,
  AcceptedStudentDocument,
} from '../Schemas/AcceptedStudent.schema';
import {
  StudentApplication,
  StudentApplicationDocument,
} from '../Schemas/studentApplication.schema';

@Injectable()
export class AcceptedStudentService {
  constructor(
    @InjectModel(AcceptedStudent.name)
    private acceptedStudentModel: Model<AcceptedStudentDocument>,

    @InjectModel(StudentApplication.name)
    private studentApplicationModel: Model<StudentApplicationDocument>,
  ) {}

  async acceptStudent(applicationId: string): Promise<AcceptedStudent> {
    // 1. Find the student in StudentApplication
    const application =
      await this.studentApplicationModel.findById(applicationId);
    if (!application) {
      throw new NotFoundException('Student application not found');
    }

    // 2. Create a new AcceptedStudent with the same data
    const acceptedStudent = new this.acceptedStudentModel({
      data: application.data,
      files: application.files,
    });
    await acceptedStudent.save();

    // 3. Remove from StudentApplication
    await this.studentApplicationModel.findByIdAndDelete(applicationId);

    return acceptedStudent;
  }

  async findAll(): Promise<AcceptedStudent[]> {
    return this.acceptedStudentModel.find().sort({ createdAt: -1 }).exec();
  }
}
