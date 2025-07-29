// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CreateContactUsDto } from '../contactus/dto/create-contactus.dto';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  async sendToHRAndUser(data: CreateContactUsDto) {
    const hrMessage = {
      from: process.env.GMAIL_USER,
      to: 'youssefsahhar2406@gmail.com',
      subject: `📥 New Contact Us Form Submission - ${data.fullName}`,
      html: `
      <div style="font-family: Arial, sans-serif; padding: 16px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #007bff;">📬 New Contact Us Submission</h2>
        <p><strong>📌 Full Name:</strong> ${data.fullName}</p>
        <p><strong>📧 Email:</strong> ${data.email}</p>
        <p><strong>📞 Phone:</strong> ${data.phone}</p>
        <p><strong>👤 Role:</strong> ${data.role}</p>
        <p><strong>🎓 Grade:</strong> ${data.grade || 'N/A'}</p>
        <p><strong>📝 Subject:</strong> ${data.subject}</p>
       
        <p><strong>💬 Message:</strong></p>
        <div style="padding: 10px; background-color: #f8f9fa; border-left: 4px solid #007bff; margin-top: -8px; margin-bottom: 16px;">
          ${data.message}
        </div>
        <footer style="font-size: 12px; color: #777;">This message was automatically sent from the Contact Us form.</footer>
      </div>
    `,
    };

    const userMessage = {
      from: process.env.GMAIL_USER,
      to: data.email,
      subject: `✅ We’ve received your message at Leaders International College`,
      html: `
      <div style="font-family: Arial, sans-serif; padding: 16px;">
        <p>Hi <strong>${data.fullName}</strong>,</p>
        <p>Thank you for contacting Leaders International College. We’ve received your message and our team will respond shortly.</p>
        <p><strong>Your Message:</strong></p>
        <blockquote style="color: #555;">${data.message}</blockquote>
        <p style="margin-top: 24px;">Best regards,<br/>Leaders International College Team</p>
      </div>
    `,
    };

    await this.transporter.sendMail(hrMessage);
    await this.transporter.sendMail(userMessage);
  }
}
