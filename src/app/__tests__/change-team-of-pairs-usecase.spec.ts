import { PrismaClient } from '@prisma/client';
import { Team } from 'src/domain/team/team';
import { TeamNameVO } from 'src/domain/team/team-name-vo';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { ChangeTeamOfPairsUseCase } from '../change-team-of-pairs-usecase';
import * as faker from 'faker';
import { Pair } from 'src/domain/team/pair';
import { PairNameVO } from 'src/domain/team/pair-name-vo';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { Identifier } from 'src/__share__/identifier';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/team-repository');

describe('【ユースケース】チームのペアを変更する', () => {
  let mockTeamRepository: MockedObjectDeep<TeamRepository>;

  beforeAll(() => {
    const prisma = new PrismaClient();
    mockTeamRepository = mocked(new TeamRepository(prisma));
  });

  it('ペアを別チームに変更', async () => {
    const memberId1 = Identifier.generator();
    const memberId2 = Identifier.generator();
    const memberId3 = Identifier.generator();

    const pairId = faker.datatype.uuid();
    const mockPair = mocked(
      new Pair({
        id: pairId,
        name: new PairNameVO('g'),
        memberIdList: [memberId1, memberId2, memberId3],
      }),
      true
    );

    const teamId1 = faker.datatype.uuid();
    const mockTeam1 = mocked(
      new Team({
        id: teamId1,
        name: new TeamNameVO('1'),
        pairList: [mockPair],
      }),
      true
    );

    const teamId2 = faker.datatype.uuid();
    const mockTeam2 = mocked(
      new Team({
        id: teamId2,
        name: new TeamNameVO('2'),
        pairList: [],
      }),
      true
    );

    mockTeamRepository.getByPairId.mockResolvedValueOnce(mockTeam1);
    mockTeamRepository.getById.mockResolvedValueOnce(mockTeam2);

    const changeTeamOfPairUseCase = new ChangeTeamOfPairsUseCase(
      mockTeamRepository
    );

    expect(mockTeam1.getPairCount()).toBe(1);
    expect(mockTeam2.getPairCount()).toBe(0);

    await changeTeamOfPairUseCase.execute({
      pairId: pairId,
      teamId: teamId2,
    });

    expect(mockTeam1.getPairCount()).toBe(0);
    expect(mockTeam2.getPairCount()).toBe(1);
  });
});
