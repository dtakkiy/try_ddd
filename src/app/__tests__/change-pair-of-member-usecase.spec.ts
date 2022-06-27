import { PrismaClient } from '@prisma/client';
import * as faker from 'faker';
import { Identifier } from 'src/__shared__/identifier';
import { Pair } from 'src/domain/pair';
import { PairNameVO } from 'src/domain/pair-name-vo';
import { Team } from 'src/domain/team';
import { TeamNameVO } from 'src/domain/team-name-vo';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { ChangePairOfMemberUseCase } from '../change-pairs-of-member-usecase';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/team-repository');
jest.mock('src/infra/db/repository/member-repository');

describe('【ユースケース】ペアのメンバーを変更する', () => {
  let mockTeamRepository: MockedObjectDeep<TeamRepository>;

  let mockPair1: Pair;
  let mockPair2: Pair;
  let mockTeam1: Team;
  let pairId1: string;
  let pairId2: string;
  let memberId1: string;
  let memberId2: string;
  let memberId3: string;
  let memberId4: string;
  let memberId5: string;

  beforeAll(() => {
    const prisma = new PrismaClient();
    mockTeamRepository = mocked(new TeamRepository(prisma));
  });

  beforeEach(() => {
    memberId1 = Identifier.generator();
    memberId2 = Identifier.generator();
    memberId3 = Identifier.generator();
    memberId4 = Identifier.generator();
    memberId5 = Identifier.generator();

    pairId1 = faker.datatype.uuid();
    mockPair1 = mocked(
      new Pair({
        id: pairId1,
        name: new PairNameVO('g'),
        memberIdList: [memberId1, memberId2, memberId3],
      }),
      true
    );

    pairId2 = faker.datatype.uuid();
    mockPair2 = mocked(
      new Pair({
        id: pairId2,
        name: new PairNameVO('g'),
        memberIdList: [memberId4, memberId5],
      }),
      true
    );

    const teamId1 = faker.datatype.uuid();
    mockTeam1 = mocked(
      new Team({
        id: teamId1,
        name: new TeamNameVO('1'),
        pairList: [mockPair1, mockPair2],
      }),
      true
    );
  });

  it('メンバーを別のペアに変更', async () => {
    mockTeamRepository.getByPairId.mockResolvedValueOnce(mockTeam1);
    mockTeamRepository.getByMemberId.mockResolvedValueOnce(mockTeam1);

    const changePairOfMemberUseCase = new ChangePairOfMemberUseCase(
      mockTeamRepository
    );

    expect(mockTeam1.getPairCount()).toBe(2);
    expect(mockTeam1.getMemberCount()).toBe(5);
    expect(mockTeam1.getPairByMemberId(memberId1)).toBe(mockPair1);

    await changePairOfMemberUseCase.execute({
      memberId: memberId1,
      pairId: pairId2,
    });

    expect(mockTeam1.getPairCount()).toBe(2);
    expect(mockTeam1.getMemberCount()).toBe(5);
    expect(mockTeam1.getPairByMemberId(memberId1)).toBe(mockPair2);
  });
});
