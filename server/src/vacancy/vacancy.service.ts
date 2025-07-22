import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vacancy } from '../Schemas/vacancy.schema';
import * as sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

@Injectable()
export class VacancyService {
  constructor(
    @InjectModel('Vacancy') private readonly vacancyModel: Model<Vacancy>,
  ) {}

  async create(createVacancyDto: { data: Record<string, any> }): Promise<Vacancy> {
    const appData = createVacancyDto.data;

    const created = new this.vacancyModel({ data: appData });
    await created.save();

    // Convert values properly for HTML
    const htmlRows = Object.entries(appData)
      .map(([key, value]) => {
        let displayValue = value;
        if (typeof value === 'object') {
          displayValue = Array.isArray(value)
            ? value.join(', ')
            : JSON.stringify(value, null, 2);
        }
        return `<tr><td><strong>${key}</strong></td><td>${displayValue}</td></tr>`;
      })
      .join('');

    const plainTextBody = Object.entries(appData)
      .map(([key, value]) => {
        let displayValue = value;
        if (typeof value === 'object') {
          displayValue = Array.isArray(value)
            ? value.join(', ')
            : JSON.stringify(value, null, 2);
        }
        return `${key}: ${displayValue}`;
      })
      .join('\n');

    const mail = {
      to: 'youssefsahhar2406@gmail.com',
      from: 'youssefsahhar2406@gmail.com', // Make sure this is verified in SendGrid
      subject: `📩 New Vacancy Application - ${appData['Full Name'] || 'Applicant'}`,
      text: `Dear HR,\n\nA new vacancy application has been submitted.\n\n${plainTextBody}\n\nBest regards,\nLeaders International College`,
      html: `
        <p>Dear HR,</p>
        <p>A new vacancy application has been submitted.</p>
        <table border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            ${htmlRows}
          </tbody>
        </table>
        <p>Best regards,<br>Leaders International College</p>
      `,
    };

    try {
      await sgMail.send(mail);
      console.log('✅ Vacancy email sent successfully!');
    } catch (err) {
      console.error('❌ Vacancy Email Error:', err.response?.body || err.message);
    }

    return created;
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
