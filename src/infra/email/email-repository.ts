import { IEmailRepository } from 'src/app/repository-interface/email-repository-interface';
import * as nodemailer from 'nodemailer';

interface MessageProps {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const MAIL_HOST = 'stmp.example.com';
const MAIL_PORT = 587; // or 465
const MAIL_ADDRESS = 'xxx@example.com';
const MAIL_PASSWORD = 'xxxxxx';
export class EmailRepository implements IEmailRepository {
  public async sendMail(messageProps: MessageProps) {
    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT || 0,
      secure: true,
      auth: {
        user: MAIL_ADDRESS,
        pass: MAIL_PASSWORD,
      },
    });

    try {
      transporter.sendMail(messageProps, (err, success) => {
        if (err) {
          // 失敗
          return false;
        }
      });
    } catch (e) {
      // 失敗
      return false;
    }

    // メール送信に成功!
    return true;
  }
}
