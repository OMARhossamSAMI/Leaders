import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactUs, ContactUsDocument } from '../Schemas/contactus.schema';
import { CreateContactUsDto } from './dto/create-contactus.dto';
import { UpdateContactUsDto } from './dto/update-contactus.dto';
import { MailService } from '../mail/mail.service'; // 👈 Add this
import * as sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

@Injectable()
export class ContactUsService {
  constructor(
    @InjectModel(ContactUs.name)
    private contactUsModel: Model<ContactUsDocument>,
    private readonly mailService: MailService, // 👈 Inject
  ) {}

  async create(createDto: CreateContactUsDto): Promise<ContactUs> {
    const created = new this.contactUsModel(createDto);
    const saved = await created.save();

    const {
      fullName,
      email,
      phone,
      role,
      grade,
      subject,

      message,
    } = createDto;

    const htmlForIT = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 24px; max-width: 700px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #ffffff; background-color: #004080; padding: 16px; border-radius: 6px; text-align: center;">
      📩 New Contact Message Received
    </h2>
    <p style="font-size: 16px;">Dear IT Team,</p>
    <p style="font-size: 16px;">You have received a new message from the contact form on the website. The details are as follows:</p>
    
    <div style="background-color: #ffffff; padding: 20px; border-radius: 6px; margin-top: 20px;">
      <p><strong>Full Name:</strong> ${fullName}</p>
      <p><strong>Email Address:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phone}</p>
      <p><strong>Role:</strong> ${role}${grade ? ` (${grade})` : ''}</p>
      
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="margin: 10px 0; padding: 12px 16px; background: #f0f4ff; border-left: 4px solid #007bff; white-space: pre-wrap;">
        ${message}
      </blockquote>
    </div>

    <p style="margin-top: 24px; font-size: 12px; color: #888;">This message was automatically sent from the Leaders International College website.</p>
  </div>
  `;

    const htmlForUser = `
  <div style="font-family: Arial, sans-serif; background-color: #f5f8fb; padding: 24px; max-width: 700px; margin: auto; border: 1px solid #ccddee; border-radius: 8px;">
    <h2 style="color: white; background-color: #007bff; padding: 16px; border-radius: 6px; text-align: center;">
      Thank You for Reaching Out
    </h2>
    <p style="font-size: 16px;">Dear <strong>${fullName}</strong>,</p>
    <p style="font-size: 16px;">We’ve received your message regarding "<strong>${subject}</strong>".</p>
    
    
    <p style="font-size: 16px;">Here is a copy of your message:</p>
    <blockquote style="margin: 10px 0; padding: 12px 16px; background: #ffffff; border-left: 4px solid #007bff; white-space: pre-wrap;">
      ${message}
    </blockquote>
    <p style="font-size: 16px;">Thank you again for contacting <strong>Leaders International College</strong>. We're here to help!</p>
    <p style="margin-top: 30px;">Sincerely,<br/><strong>IT Support Team</strong><br/>Leaders International College</p>
  </div>
  `;

    const itNotification = {
      to: 'Admissionoffice@leadersintcollege.com',
      from: {
        email: 'youssefsahhar2406@gmail.com',
        name: 'Contact Portal',
      },
      subject: `📬 New Contact Request: ${subject} from ${fullName}`,
      html: htmlForIT,
    };

    const userConfirmation = {
      to: email,
      from: {
        email: 'youssefsahhar2406@gmail.com',
        name: 'Leaders International College',
      },
      subject: `✅ We’ve received your message, ${fullName}`,
      html: htmlForUser,
    };

    try {
      await Promise.all([
        sgMail.send(itNotification),
        sgMail.send(userConfirmation),
      ]);
      return saved;
    } catch (error) {
      console.error('❌ Failed to send contact form emails:', error);
      if (error?.response?.body) {
        console.error('SendGrid error:', error.response.body);
      }
      throw new Error('Message saved but failed to send confirmation email.');
    }
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
