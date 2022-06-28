import { IEmailRepository } from './repository-interface/email-repository-interface';

interface MessageProps {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class SendEmailUseCase {
  constructor(private readonly emailRepository: IEmailRepository) {
    this.emailRepository = emailRepository;
  }

  public async execute(messageProps: MessageProps) {
    return await this.emailRepository.sendMail(messageProps);
  }
}
