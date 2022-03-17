interface Props {
  from: string;
  to: string;
  title: string;
  content: string;
}

export interface IEmailRepository {
  sendMail(props: Props): Promise<boolean>;
}
