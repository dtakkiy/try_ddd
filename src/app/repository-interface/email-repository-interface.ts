interface MessageProps {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface IEmailRepository {
  sendMail(messageProps: MessageProps): Promise<boolean>;
}
