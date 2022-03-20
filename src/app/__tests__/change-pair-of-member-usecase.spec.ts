import { PrismaClient } from '@prisma/client';
import { Team } from 'src/domain/team/team';
import { TeamNameVO } from 'src/domain/team/team-name-vo';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import * as faker from 'faker';
import { Pair } from 'src/domain/team/pair';
import { PairNameVO } from 'src/domain/team/pair-name-vo';
import { MemberFactory } from 'src/domain/member/member-factory';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { Member } from 'src/domain/member/member';
import { ChangePairOfMemberUseCase } from '../change-pairs-of-member-usecase';
import { Identifier } from 'src/__share__/identifier';
import { MemberStatus } from 'src/domain/member/member-status';
import { MemberNameVO } from 'src/domain/member/member-name-vo';
import { MemberEmailVO } from 'src/domain/member/member-email-vo';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/team-repository');

describe('【ユースケース】ペアのメンバーを変更する', () => {
  let mockTeamRepository: MockedObjectDeep<TeamRepository>;

  let member1: Member;
  let member2: Member;
  let member3: Member;
  let member4: Member;
  let member5: Member;
  let mockPair1: Pair;
  let mockPair2: Pair;
  let mockTeam1: Team;
  let pairId1: string;
  let pairId2: string;
  let memberId1: string;

  beforeAll(() => {
    const prisma = new PrismaClient();
    mockTeamRepository = mocked(new TeamRepository(prisma));
  });

  beforeEach(() => {
    memberId1 = Identifier.generator();
    member1 = new Member({
      id: memberId1,
      name: new MemberNameVO('john'),
      email: new MemberEmailVO('john@example.com'),
      status: MemberStatus.create(),
    });

    member2 = mocked(
      MemberFactory.execute({
        name: 'bob',
        email: 'bob@example.com',
      }),
      true
    );

    member3 = mocked(
      MemberFactory.execute({
        name: 'alice',
        email: 'alice@example.com',
      }),
      true
    );

    member4 = mocked(
      MemberFactory.execute({
        name: 'xxx',
        email: 'xxx@example.com',
      }),
      true
    );

    member5 = mocked(
      MemberFactory.execute({
        name: 'yyy',
        email: 'yyy@example.com',
      }),
      true
    );

    pairId1 = faker.datatype.uuid();
    mockPair1 = mocked(
      new Pair({
        id: pairId1,
        name: new PairNameVO('g'),
        memberList: [member1, member2, member3],
      }),
      true
    );

    pairId2 = faker.datatype.uuid();
    mockPair2 = mocked(
      new Pair({
        id: pairId2,
        name: new PairNameVO('g'),
        memberList: [member4, member5],
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
    //    mockTeamRepository.getByPairId.mockResolvedValueOnce(mockTeam1);

    const changePairOfMemberUseCase = new ChangePairOfMemberUseCase(
      mockTeamRepository
    );

    expect(mockTeam1.getPairCount()).toBe(2);
    expect(mockTeam1.getMemberCount()).toBe(5);

    await changePairOfMemberUseCase.execute({
      memberId: memberId1,
      pairId: pairId2,
    });
  });
});
