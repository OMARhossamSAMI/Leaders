import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  StudentApplication,
  StudentApplicationDocument,
} from '../Schemas/studentApplication.schema';
import { Model } from 'mongoose';
import * as sgMail from '@sendgrid/mail';

// ✅ Confirm API key
console.log(
  'SENDGRID API KEY (partial):',
  process.env.SENDGRID_API_KEY?.slice(0, 10) || 'Not found',
);

// ✅ Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

@Injectable()
export class StudentApplicationService {
  constructor(
    @InjectModel(StudentApplication.name)
    private appModel: Model<StudentApplicationDocument>,
  ) {}

 async submitApplication(
  formData: Record<string, any>,
  files?: Express.Multer.File[],
): Promise<any> {
  console.log('📥 Incoming application data:', formData);

  const fileMetadata = Array.isArray(files)
    ? files.map((file) => ({
        originalname: file.originalname,
        // ✅ Save relative URL, not absolute system path
        path: `uploads/${file.filename}`,
      }))
    : [];

  const createdApp = new this.appModel({
    data: formData,
    files: fileMetadata,
  });

  await createdApp.save();

  const applicationHtmlRows = Object.entries(formData)
    .map(([key, value]) => {
      const safeValue =
        value === null || value === undefined
          ? ''
          : typeof value === 'object'
            ? JSON.stringify(value)
            : String(value);
      return `<tr><td><strong>${key}</strong></td><td>${safeValue}</td></tr>`;
    })
    .join('');

  const fullApplicationHtml = `
    <table border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        ${applicationHtmlRows}
      </tbody>
    </table>
  `;

  const hrMail = {
    to: 'youssefsahhar2406@gmail.com',
    from: 'youssefsahhar2406@gmail.com',
    subject: `📥 New Application from ${formData.student_name}`,
    html: `
      <h3>Full Student Application</h3>
      ${fullApplicationHtml}
      <p>Attached files:</p>
      <ul>
        ${fileMetadata
          .map((file) => `<li>${file.originalname}</li>`)
          .join('')}
      </ul>
      <p>Login to the admin dashboard for more actions.</p>
    `,
  };

  try {
    await sgMail.send(hrMail);
    return {
      message: '✅ Application saved and full data sent via email.',
    };
  } catch (err) {
    console.error(
      '❌ SendGrid Email Error:',
      err.response?.body || err.message,
    );
    throw new Error('Application saved but failed to send emails.');
  }
}


  async getAllApplications() {
    const applications = await this.appModel
      .find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return applications.map((app) => {
      const { data = {}, ...rest } = app;
      return {
        ...rest,
        ...data,
      };
    });
  }

  async deleteApplication(id: string) {
    return this.appModel.findByIdAndDelete(id);
  }

  async updateApplication(id: string, updateData: Partial<StudentApplication>) {
    return this.appModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async getApplicationById(id: string) {
    return this.appModel.findById(id).exec();
  }
}
