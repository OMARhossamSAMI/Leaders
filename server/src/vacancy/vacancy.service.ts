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
    @InjectModel('FormField') private readonly formFieldModel: Model<any>, // Adjust the type as needed
  ) {}

  async create(
    data: Record<string, any>,
    files: Record<string, Express.Multer.File[]>,
  ): Promise<Vacancy> {
    // Attach file URLs if any exist
    for (const key in files) {
      const fileArray = files[key];
      if (fileArray.length > 0) {
        data[key] = fileArray.map(
          (file) => `http://localhost:3000/uploads/${file.filename}`,
        );
      }
    }

    const created = new this.vacancyModel({ data });
    await created.save();

    const htmlRows = Object.entries(data)
      .map(([key, value]) => {
        let displayValue = value;
        if (Array.isArray(value)) {
          displayValue = value.map((v) => v.toString()).join(', ');
        } else if (typeof value === 'object') {
          displayValue = JSON.stringify(value);
        }

        // Convert file links to clickable
        if (
          typeof displayValue === 'string' &&
          displayValue.startsWith('http')
        ) {
          displayValue = `<a href="${displayValue}" target="_blank">${key}</a>`;
        }

        return `<tr><td><strong>${key}</strong></td><td>${displayValue}</td></tr>`;
      })
      .join('');

    const plainText = Object.entries(data)
      .map(([key, value]) => {
        if (Array.isArray(value)) return `${key}: ${value.join(', ')}`;
        return `${key}: ${value}`;
      })
      .join('\n');

    const mail = {
      to: 'omar.hossam3@gmail.com',
      from: 'youssefsahhar2406@gmail.com',
      subject: `📩 New Vacancy Application - ${data['full_name'] || 'Applicant'}`,
      text: `Dear HR,\n\nA new vacancy application has been submitted.\n\n${plainText}\n\nBest regards,\nLeaders International College`,
      html: `
      <p>Dear HR,</p>
      <p>A new vacancy application has been submitted.</p>
      <table border="1" cellpadding="6" style="width: 100%; border-collapse: collapse;">
        <thead><tr style="background-color: #f2f2f2;"><th>Field</th><th>Value</th></tr></thead>
        <tbody>${htmlRows}</tbody>
      </table>
      <p>Best regards,<br>Leaders International College</p>
    `,
    };

    try {
      await sgMail.send(mail);
      console.log('✅ Email sent');
    } catch (err) {
      console.error('❌ Email Error:', err.response?.body || err.message);
    }

    return created;
  }

  async findAll() {
    return this.vacancyModel.find().sort({ createdAt: -1 });
  }

  async exportCSV(): Promise<string> {
    const vacancies = await this.vacancyModel.find().lean();
    const formFields = await this.formFieldModel.find().lean();

    const headers = formFields.map((f) => f.label);
    headers.push('Submitted At');

    const rows = [headers.join(',')];

    vacancies.forEach((vac) => {
      const data = vac.data || {};

      const row = formFields.map((field) => {
        const val = data[field.field_name]; // key from schema
        const cell = Array.isArray(val)
          ? `"${val.join(', ').replace(/"/g, '""')}"`
          : `"${(val ?? '').toString().replace(/"/g, '""')}"`;
        return cell;
      });

      const createdAt = vac.createdAt
        ? new Date(vac.createdAt).toLocaleString()
        : 'N/A';
      row.push(`"${createdAt.replace(/"/g, '""')}"`);

      rows.push(row.join(','));
    });

    return rows.join('\n');
  }

  async update(id: string, newData: Record<string, any>) {
    return this.vacancyModel.findByIdAndUpdate(
      id,
      { data: newData },
      { new: true },
    );
  }

  async delete(id: string) {
    return this.vacancyModel.findByIdAndDelete(id);
  }
}
