import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  StudentApplication,
  StudentApplicationDocument,
} from '../Schemas/studentApplication.schema';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';

@Injectable()
export class StudentApplicationService {
  constructor(
    @InjectModel(StudentApplication.name)
    private appModel: Model<StudentApplicationDocument>,
  ) {}

  async submitApplication(data: any): Promise<any> {
    const createdApp = new this.appModel(data);
    await createdApp.save();

    // Setup email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const parentEmails = [data.father_email, data.mother_email]
      .filter(Boolean)
      .join(',');

    const parentMail = {
      from: process.env.MAIL_USER,
      to: parentEmails,
      subject: 'LIC Application Received',
      html: `<p>Dear Parent,</p>
             <p>We’ve received the application for <b>${data.student_name}</b>. Our admissions team will contact you soon.</p>
             <p>Regards,<br>Leaders International College</p>`,
    };

    const hrMail = {
      from: process.env.MAIL_USER,
      to: 'careers@leadersintcollege.com',
      subject: `New Application: ${data.student_name}`,
      html: `<h3>New Student Application Submitted</h3>
             <p><strong>Student:</strong> ${data.student_name}</p>
             <p><strong>Grade:</strong> ${data.grade_applying_for}</p>
             <p><strong>Father:</strong> ${data.father_name} (${data.father_email})</p>
             <p><strong>Mother:</strong> ${data.mother_name} (${data.mother_email})</p>
             <p>--</p>
             <p>See all info in the admin dashboard or database.</p>`,
    };

    try {
      await transporter.sendMail(parentMail);
      await transporter.sendMail(hrMail);
      return { message: 'Application submitted and emails sent.' };
    } catch (err) {
      console.error(err);
      throw new Error('Application saved but failed to send email.');
    }
  }

  async getAllApplications() {
    return this.appModel
      .find({}, 'student_name grade_applying_for createdAt') // only select required fields
      .sort({ createdAt: -1 }) // newest first
      .exec();
  }

  async deleteApplication(id: string) {
    return this.appModel.findByIdAndDelete(id);
  }

  async updateApplication(id: string, updateData: Partial<StudentApplication>) {
  return this.appModel.findByIdAndUpdate(id, updateData, { new: true });
}
  async getApplicationById(id: string) {
  return this.appModel.findById(id).exec(); // ✅ don't forget ()
}


}
