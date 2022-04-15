import { IEmailRepository } from './repository-interface/email-repository-interface';

interface MessageProps {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class SendEmailUseCase {
  private readonly emailRepository: IEmailRepository;
  constructor(emailRepository: IEmailRepository) {
    this.emailRepository = emailRepository;
  }

  public async execute(messageProps: MessageProps) {
    return await this.emailRepository.sendMail(messageProps);
  }
}
