import { EmailRepository } from 'src/infra/email/email-repository';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { SendEmailUseCase } from '../send-email-usecase';

jest.mock('src/infra/email/email-repository');

describe('emailの送信', () => {
  let mockEmailRepository: MockedObjectDeep<EmailRepository>;

  beforeAll(() => {
    mockEmailRepository = mocked(new EmailRepository(), true);
  });

  it('インスタンスを作成できるか？', async () => {
    const message = {
      from: 'taro@exmaple.com',
      to: 'jiro@example.com',
      subject: 'テストメール',
      html: '本文',
    };

    mockEmailRepository.sendMail.mockResolvedValueOnce(true);

    const usecase = new SendEmailUseCase(mockEmailRepository);
    await expect(usecase.execute(message)).resolves.toBe(true);
  });
});
