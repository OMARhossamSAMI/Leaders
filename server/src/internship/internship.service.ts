import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Internship, InternshipDocument } from '../Schemas/internship.schema';
import { Model } from 'mongoose';
import { CreateInternshipDto } from './dto/create-internship.dto';
import * as sgMail from '@sendgrid/mail';
import axios from 'axios';
import * as fs from 'fs';
import { join } from 'path'; // if not already imported
// ✅ Set API key immediately after importing SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

@Injectable()
export class InternshipService {
  constructor(
    @InjectModel(Internship.name)
    private internshipModel: Model<InternshipDocument>,
  ) {}

  async create(createInternshipDto: CreateInternshipDto): Promise<Internship> {
    const created = new this.internshipModel(createInternshipDto);
    const savedApplication = await created.save();
    console.log('🔑 SENDGRID_API_KEY loaded?', !!process.env.SENDGRID_API_KEY);

    const {
      full_name,
      email,
      phone,
      university,
      degree,
      year_of_study,
      start_date,
      duration,
      desired_position,
      motivation,
      cv_file_url,
      cover_letter_url,
    } = createInternshipDto;

    // ✅ Step 1: Try downloading and encoding the CV
    let cvAttachment: any = null;

    if (cv_file_url) {
      try {
        const baseUrl = process.env.Backend_URL; // ✅ your domain here
        console.log('🔗 BackendUrl:', baseUrl);
        const fullCvUrl = `${baseUrl}${cv_file_url}`;

        const response = await axios.get(fullCvUrl, {
          responseType: 'arraybuffer',
        });

        const cvBase64 = Buffer.from(response.data as ArrayBuffer).toString(
          'base64',
        );

        cvAttachment = {
          content: cvBase64,
          filename: `${full_name.replace(/\s+/g, '_')}_CV.pdf`,
          type: 'application/pdf',
          disposition: 'attachment',
        };
      } catch (err) {
        console.error('⚠️ Failed to fetch/encode CV PDF:', err.message);
      }
    }
    let coverLetterAttachment: any = null;

    if (cover_letter_url) {
      try {
        const baseUrl = process.env.Backend_URL;
        const fullCoverUrl = `${baseUrl}${cover_letter_url}`;

        const response = await axios.get(fullCoverUrl, {
          responseType: 'arraybuffer',
        });

        const coverBase64 = Buffer.from(response.data as ArrayBuffer).toString(
          'base64',
        );

        coverLetterAttachment = {
          content: coverBase64,
          filename: `${full_name.replace(/\s+/g, '_')}_Cover_Letter.pdf`,
          type: 'application/pdf',
          disposition: 'attachment',
        };
      } catch (err) {
        console.error(
          '⚠️ Failed to fetch/encode Cover Letter PDF:',
          err.message,
        );
      }
    }

    const formattedHtml = `
  <div style="font-family: Arial, sans-serif; color: #333; background-color: #f7f9fc; padding: 30px; max-width: 700px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
    <h2 style="color: #ffffff; background-color: #004080; padding: 15px 20px; border-radius: 4px; text-align: center;">
      New Internship Application Received
    </h2>
    <p><strong>Full Name:</strong> ${full_name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>University:</strong> ${university}</p>
    <p><strong>Degree:</strong> ${degree}</p>
    <p><strong>Year of Study:</strong> ${year_of_study}</p>
    <p><strong>Start Date:</strong> ${new Date(start_date).toLocaleDateString()}</p>
    <p><strong>Duration:</strong> ${duration}</p>
    <p><strong>Desired Position:</strong> ${desired_position}</p>
    ${motivation ? `<p><strong>Motivation:</strong><br>${motivation}</p>` : ''}
    <p style="margin-top: 30px; font-style: italic;">📎 CV attached below.</p>
    <p style="margin-top: 40px; font-size: 12px; color: #888;">This message was generated automatically by the internship portal of Leaders International College.</p>
    <p style="margin-top: 30px;">Visit the admin dashboard to review this application in full.</p>
  </div>
`;

    const applicantConfirmation = {
      to: email,
      from: {
        email: 'youssefsahhar2406@gmail.com',
        name: 'Leaders International College Careers',
      },
      subject: `🎓 Thank you for applying, ${full_name}!`,
      html: `
  <div style="font-family: Arial, sans-serif; color: #333; background-color: #f8fafd; padding: 30px; max-width: 700px; margin: auto; border: 1px solid #d6e0ef; border-radius: 8px;">
    <h2 style="color: #ffffff; background-color: #007bff; padding: 15px 20px; border-radius: 4px; text-align: center;">
      Internship Application Received
    </h2>
    <p>Dear <strong>${full_name}</strong>,</p>
    <p>Thank you for applying for an internship at <strong>Leaders International College</strong>.</p>
    <p>We appreciate your interest in joining our team. Our HR department is currently reviewing all applications carefully. If your qualifications and profile match the requirements for any current opportunity, you will be contacted for the next steps.</p>
    <p>If you are not selected this round, we will keep your profile in our talent pool for future openings.</p>
    <p style="margin-top: 20px;">We wish you the best in your academic and professional journey.</p>
    <p style="margin-top: 30px;">Sincerely,<br><strong>HR Department</strong><br>Leaders International College</p>
  </div>
`,
    };

    const hrNotification: any = {
      to: 'Admissionoffice@leadersintcollege.com',
      from: {
        email: 'youssefsahhar2406@gmail.com',
        name: 'Internship Applications',
      },
      subject: `📥 Internship Application from ${full_name}`,
      html: formattedHtml,
    };

    // ✅ Step 2: Add attachment if available
    if (cvAttachment) {
      hrNotification.attachments = [
        cvAttachment,
        ...(coverLetterAttachment ? [coverLetterAttachment] : []),
      ];
    }

    try {
      await Promise.all([
        sgMail.send(applicantConfirmation),
        sgMail.send(hrNotification),
      ]);

      return savedApplication;
    } catch (error) {
      console.error('❌ Failed to send internship emails:', error);

      if (error?.response?.body) {
        console.error('SendGrid error response:', error.response.body);
      }

      throw new Error(
        'Internship application saved, but failed to send emails.',
      );
    }
  }

  async findAll(): Promise<Internship[]> {
    return this.internshipModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Internship | null> {
    return this.internshipModel.findById(id).exec();
  }

  async delete(id: string): Promise<void> {
    const internship = await this.internshipModel.findById(id);
    if (!internship) {
      throw new NotFoundException(`Internship application not found`);
    }

    // ✅ Delete uploaded files from filesystem
    const filePaths = [
      internship.cv_file_url,
      internship.cover_letter_url,
    ].filter(Boolean);
    for (const pathString of filePaths) {
      const filename = pathString?.split('/uploads/')[1];
      if (filename) {
        const fullPath = join(__dirname, '..', '..', 'uploads', filename);
        try {
          await fs.promises.unlink(fullPath);
          console.log(`🗑️ Deleted file: ${fullPath}`);
        } catch (err) {
          console.warn(`⚠️ Could not delete file: ${fullPath}`, err.message);
        }
      }
    }

    // ✅ Delete document from DB
    await this.internshipModel.findByIdAndDelete(id);
  }
}
