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
import fetch from 'node-fetch';
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
  async deleteById(id: string): Promise<AcceptedStudent> {
    const deleted = await this.acceptedStudentModel
      .findByIdAndDelete(id)
      .exec();
    if (!deleted) {
      throw new NotFoundException('Accepted student not found');
    }
    return deleted;
  }
  private normalizePhoneNumber(input: string): string {
    // Remove spaces, plus signs, and non-digit characters
    let digits = input.replace(/\D/g, '');

    // If it starts with "0", remove it and prefix with your country code (Egypt = 20)
    if (digits.startsWith('0')) {
      digits = '20' + digits.slice(1);
    }

    return digits;
  }
  async sendAssessmentMessage(
    id: string,
    {
      fatherName,
      studentName,
      date,
      time,
      phoneNumber,
    }: {
      fatherName: string;
      studentName: string;
      date: string;
      time: string;
      phoneNumber: string;
    },
  ) {
    const student = await this.acceptedStudentModel.findById(id);

    if (!student) {
      throw new Error('Student not found');
    }

    if (student.assessmentMessageSent) {
      return { error: 'Assessment message already sent to this student' };
    }

    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const normalizedPhone = this.normalizePhoneNumber(phoneNumber);

    const res = await fetch(
      `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: normalizedPhone,
          type: 'template',
          template: {
            name: 'assessment_invitation',
            language: { code: 'en' },
            components: [
              {
                type: 'header',
                parameters: [
                  {
                    type: 'image',
                    image: {
                      link: 'https://leadersintcollege.com/assets/img/Whatapp_LIC.png',
                    },
                  },
                ],
              },
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: fatherName },
                  { type: 'text', text: studentName },
                  { type: 'text', text: date },
                  { type: 'text', text: time },
                ],
              },
            ],
          },
        }),
      },
    );

    const data = await res.json();

    if (!data.error) {
      // ✅ Mark as sent
      student.assessmentMessageSent = true;
      await student.save();
    }

    return data;
  }
}
