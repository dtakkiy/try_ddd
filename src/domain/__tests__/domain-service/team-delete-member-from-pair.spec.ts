import { PrismaClient } from '@prisma/client';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { EmailRepository } from 'src/infra/email/email-repository';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { DeleteMemberFromPair } from '../../domain-service/team-delete-member-from-pair';
import { TeamMemberUpdate } from '../../domain-service/team-member-update';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/team-repository');
jest.mock('src/infra/email/email-repository');

describe('team-delete-memberのテスト', () => {
  let mockTeamRepository: MockedObjectDeep<TeamRepository>;
  let mockEmailRepository: MockedObjectDeep<EmailRepository>;
  let teamMemberUpdate: TeamMemberUpdate;

  beforeAll(() => {
    const prisma = new PrismaClient();
    mockTeamRepository = mocked(new TeamRepository(prisma), true);
    mockEmailRepository = mocked(new EmailRepository(), true);
    teamMemberUpdate = new TeamMemberUpdate(prisma);
  });

  it('インスタンスの生成', () => {
    expect(
      new DeleteMemberFromPair(
        mockTeamRepository,
        mockEmailRepository,
        teamMemberUpdate
      )
    ).toBeInstanceOf(DeleteMemberFromPair);
  });
});
