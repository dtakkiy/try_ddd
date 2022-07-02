import { PrismaClient } from '@prisma/client';
import * as faker from 'faker';
import { DomainError, Result } from 'src/__shared__/result';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { MemberFactory } from '../domain-service/member-factory';
import { AddMemberToFewestTeam } from '../domain-service/team-add-member-to-fewest-team';
import { TeamMemberUpdate } from '../domain-service/team-member-update';
import { Member } from '../member';
import { Pair } from '../pair';
import { PairNameVO } from '../pair-name-vo';
import { Team } from '../team';
import { TeamNameVO } from '../team-name-vo';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/team-repository');

describe('team-add-memberのテスト', () => {
  let mockTeamRepository: MockedObjectDeep<TeamRepository>;
  let mockTeamMemberUpdate: MockedObjectDeep<TeamMemberUpdate>;

  let teamId: string;
  let team: Team;
  let pair1: Result<Pair, DomainError>;
  let pair2: Result<Pair, DomainError>;
  let teamId2: string;
  let team2: Team;

  beforeAll(() => {
    const prisma = new PrismaClient();
    mockTeamRepository = mocked(new TeamRepository(prisma), true);
    mockTeamMemberUpdate = mocked(new TeamMemberUpdate(prisma), true);
  });

  beforeEach(() => {
    const member1 = MemberFactory.execute({
      name: 'a',
      email: 'a@example.com',
    });
    const member2 = MemberFactory.execute({
      name: 'a',
      email: 'a@example.com',
    });
    const member3 = MemberFactory.execute({
      name: 'a',
      email: 'a@example.com',
    });
    const member4 = MemberFactory.execute({
      name: 'a',
      email: 'a@example.com',
    });
    const member5 = MemberFactory.execute({
      name: 'a',
      email: 'a@example.com',
    });

    if (
      member1 === null ||
      member2 === null ||
      member3 === null ||
      member4 === null ||
      member5 === null
    ) {
      return;
    }

    pair1 = Pair.create({
      id: faker.datatype.uuid(),
      name: new PairNameVO('a'),
      memberIdList: [member1.id, member2.id, member3.id],
    });

    if (pair1.isFailure()) {
      return;
    }

    pair2 = Pair.create({
      id: faker.datatype.uuid(),
      name: new PairNameVO('b'),
      memberIdList: [member4.id, member5.id],
    });

    if (pair2.isFailure()) {
      return;
    }

    const pair3 = Pair.create({
      id: faker.datatype.uuid(),
      name: new PairNameVO('a'),
      memberIdList: [member1.id, member2.id],
    });

    if (pair3.isFailure()) {
      return;
    }

    const pair4 = Pair.create({
      id: faker.datatype.uuid(),
      name: new PairNameVO('b'),
      memberIdList: [member4.id, member5.id],
    });

    if (pair4.isFailure()) {
      return;
    }

    teamId = faker.datatype.uuid();
    team = Team.reconstruct({
      id: teamId,
      name: new TeamNameVO('1'),
      pairList: [pair1.value, pair2.value],
    });

    teamId2 = faker.datatype.uuid();
    team2 = Team.reconstruct({
      id: teamId2,
      name: new TeamNameVO('2'),
      pairList: [pair3.value, pair4.value],
    });
  });

  it('インスタンスの生成', () => {
    expect(
      new AddMemberToFewestTeam(mockTeamRepository, mockTeamMemberUpdate)
    ).toBeInstanceOf(AddMemberToFewestTeam);
  });

  // it('チームにメンバーを追加できる', async () => {
  //   mockTeamRepository.getAll.mockResolvedValueOnce([team, team2]);

  //   const addMemberToFewestTeam = new AddMemberToFewestTeam(
  //     mockTeamRepository,
  //     mockTeamMemberUpdate
  //   );

  //   const addMember = MemberFactory.execute({
  //     name: 'z',
  //     email: 'z@example.com',
  //   });

  //   if (addMember === null) {
  //     return;
  //   }

  //   const result = await addMemberToFewestTeam.execute(addMember);
  //   expect(result.isSuccess()).toBeTruthy();
  // });
});
