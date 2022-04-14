import { PrismaClient } from '@prisma/client';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { AddMemberToFewestTeam } from '../domain-service/team-add-member-to-fewest-team';
import { TeamMemberUpdate } from '../domain-service/team-member-update';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/team-repository');

describe('team-add-memberのテスト', () => {
  let mockTeamRepository: MockedObjectDeep<TeamRepository>;
  let teamMemberUpdate: TeamMemberUpdate;

  beforeAll(() => {
    const prisma = new PrismaClient();
    mockTeamRepository = mocked(new TeamRepository(prisma), true);
    teamMemberUpdate = new TeamMemberUpdate(prisma);
  });

  it('インスタンスの生成', () => {
    expect(
      new AddMemberToFewestTeam(mockTeamRepository, teamMemberUpdate)
    ).toBeInstanceOf(AddMemberToFewestTeam);
  });
});
