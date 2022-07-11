import * as nodemailer from 'nodemailer';
import { IEmailRepository } from 'src/app/repository-interface/email-repository-interface';

interface MessageProps {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailRepository implements IEmailRepository {
  MAIL_HOST = 'stmp.example.com';
  MAIL_PORT = 587; // or 465
  MAIL_ADDRESS = 'xxx@example.com';
  MAIL_PASSWORD = 'xxxxxx';

  public async sendMail(messageProps: MessageProps) {
    const transporter = nodemailer.createTransport({
      host: this.MAIL_HOST,
      port: this.MAIL_PORT || 0,
      secure: true,
      auth: {
        user: this.MAIL_ADDRESS,
        pass: this.MAIL_PASSWORD,
      },
    });

    try {
      transporter.sendMail(messageProps, (err, success) => {
        if (err) {
          // 失敗
          return false;
        }

        if (success) {
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
