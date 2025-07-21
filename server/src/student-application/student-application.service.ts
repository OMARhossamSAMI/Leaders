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
  process.env.SENDGRID_API_KEY?.slice(0, 10) || 'Not found'
);

// ✅ Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

@Injectable()
export class StudentApplicationService {
  constructor(
    @InjectModel(StudentApplication.name)
    private appModel: Model<StudentApplicationDocument>
  ) {}

  async submitApplication(data: any): Promise<any> {
  console.log('📥 Incoming application data:', data);

  const appData = data.data || data;

  const createdApp = new this.appModel(appData);
  await createdApp.save();

  // 🔁 Convert application data to HTML table rows
  const applicationHtmlRows = Object.entries(appData)
    .map(([key, value]) => `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`)
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

  const parentMail = {
    to: [{ email: 'youssefsahhar2406@gmail.com' }],
    from: 'youssefsahhar2406@gmail.com',
    subject: '✅ Parent Application Received',
    html: `
      <p>Dear Parent,</p>
      <p>We’ve received the application for <b>${appData.student_name}</b>. Our admissions team will contact you soon.</p>
      ${fullApplicationHtml}
      <p>Regards,<br>Leaders International College</p>
    `,
  };

  const hrMail = {
    to: 'youssefsahhar2406@gmail.com',
    from: 'youssefsahhar2406@gmail.com',
    subject: `📥 New Application from ${appData.student_name}`,
    html: `
      <h3>Full Student Application</h3>
      ${fullApplicationHtml}
      <p>Login to the admin dashboard for more actions.</p>
    `,
  };

  const testMail = {
    to: 'youssefsahhar2406@gmail.com',
    from: 'youssefsahhar2406@gmail.com',
    subject: `🧪 SendGrid Test Email – ${appData.student_name}`,
    html: `
      <h2>Testing Full Application Email Render</h2>
      ${fullApplicationHtml}
    `,
  };

  try {
    //await sgMail.send(parentMail);
    await sgMail.send(hrMail);
    //await sgMail.send(testMail);
    return {
      message: '✅ Application saved and full data sent via email.',
    };
  } catch (err) {
    console.error('❌ SendGrid Email Error:', err.response?.body || err.message);
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

  async updateApplication(
    id: string,
    updateData: Partial<StudentApplication>
  ) {
    return this.appModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async getApplicationById(id: string) {
    return this.appModel.findById(id).exec();
  }
}
