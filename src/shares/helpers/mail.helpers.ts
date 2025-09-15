import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import * as config from 'config'
const email = config.get<string>('mail.account')
const password = config.get<string>('mail.password')

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "lastnight7749@gmail.com",
        pass: "joth fiap trla pbwd",
      },
    });
  }

  async sendMail({ email, subject, html }): Promise<any> {
    const mailOptions = {
      from: "lastnight7749@gmail.com",
      to: email,
      subject,
      html,
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(info);
      return { success: 'Send mail successfully' };
    } catch (error) {
      console.error(error);
      return { error: error.message };
    }
  }
}
