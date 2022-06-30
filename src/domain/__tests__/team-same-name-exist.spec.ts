import { PrismaClient } from '@prisma/client';
import * as faker from 'faker';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { MemberFactory } from '../domain-service/member-factory';
import { TeamSameNameExist } from '../domain-service/team-same-name-exist';
import { Pair } from '../pair';
import { PairNameVO } from '../pair-name-vo';
import { Team } from '../team';
import { TeamNameVO } from '../team-name-vo';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/team-repository');

describe('team-same-existのテスト', () => {
  let mockTeamRepository: MockedObjectDeep<TeamRepository>;
  let teamId: string;
  let team: Team;
  let pair1: Pair | null;
  let pair2: Pair | null;
  let teamId2: string;
  let team2: Team;
  let teamId3: string;
  let team3: Team;

  beforeAll(() => {
    const prisma = new PrismaClient();
    mockTeamRepository = mocked(new TeamRepository(prisma), true);
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
    const member6 = MemberFactory.execute({
      name: 'a',
      email: 'a@example.com',
    });

    pair1 = Pair.create({
      id: faker.datatype.uuid(),
      name: new PairNameVO('a'),
      memberIdList: [member1.id, member2.id, member3.id],
    });

    if (pair1 === null) {
      return;
    }

    pair2 = Pair.create({
      id: faker.datatype.uuid(),
      name: new PairNameVO('b'),
      memberIdList: [member4.id, member5.id, member6.id],
    });
    if (pair2 === null) {
      return;
    }

    teamId = faker.datatype.uuid();
    team = new Team({
      id: teamId,
      name: new TeamNameVO('1'),
      pairList: [pair1, pair2],
    });

    teamId2 = faker.datatype.uuid();
    team2 = new Team({
      id: teamId2,
      name: new TeamNameVO('2'),
      pairList: [pair1, pair2],
    });

    teamId3 = faker.datatype.uuid();
    team3 = new Team({
      id: teamId3,
      name: new TeamNameVO('3'),
      pairList: [pair1, pair2],
    });
  });

  it('インスタンス生成', () => {
    const teamSameNameExist = new TeamSameNameExist(mockTeamRepository);
    expect(teamSameNameExist).toBeInstanceOf(TeamSameNameExist);
  });

  it('チーム名が存在するか', async () => {
    const teamSameNameExist = new TeamSameNameExist(mockTeamRepository);
    mockTeamRepository.getAll.mockResolvedValueOnce([team, team2]);
    await expect(teamSameNameExist.isTeamName('1')).resolves.toBeTruthy();

    mockTeamRepository.getAll.mockResolvedValueOnce([team, team2]);
    await expect(teamSameNameExist.isTeamName('5')).resolves.not.toBeTruthy();
  });

  it('チーム名の一覧を取得', async () => {
    const teamSameNameExist = new TeamSameNameExist(mockTeamRepository);
    mockTeamRepository.getAll.mockResolvedValueOnce([team, team2, team3]);
    await expect(teamSameNameExist.getTeamNameList()).resolves.toStrictEqual([
      1, 2, 3,
    ]);
  });
});
