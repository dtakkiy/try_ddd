import { IEmailRepository } from './repository-interface/email-repository-interface';

interface Props {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class SendEmailUseCase {
  private readonly repo: IEmailRepository;
  constructor(repo: IEmailRepository) {
    this.repo = repo;
  }

  public async execute(props: Props) {
    return await this.repo.sendMail(props);
  }
}
