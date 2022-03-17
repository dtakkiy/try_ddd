import { IEmailRepository } from 'src/app/infra/email/email-repository-interface';

interface Props {
  from: string;
  to: string;
  title: string;
  content: string;
}

export class EmailRepository implements IEmailRepository {
  public async sendMail(props: Props) {
    // 何某かのメール送信の処理を記述
    return true;
  }
}
