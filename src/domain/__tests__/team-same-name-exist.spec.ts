import { PrismaClient } from '@prisma/client';
import * as faker from 'faker';
import { DomainError, Result } from 'src/__shared__/result';
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
  let pair1: Result<Pair, DomainError>;
  let pair2: Result<Pair, DomainError>;
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

    if (
      member1 === null ||
      member2 === null ||
      member3 === null ||
      member4 === null ||
      member5 === null ||
      member6 === null
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
      memberIdList: [member4.id, member5.id, member6.id],
    });
    if (pair2.isFailure()) {
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
      pairList: [pair1.value, pair2.value],
    });

    teamId3 = faker.datatype.uuid();
    team3 = Team.reconstruct({
      id: teamId3,
      name: new TeamNameVO('3'),
      pairList: [pair1.value, pair2.value],
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
  });

  it('チーム名が存在しない場合', async () => {
    const teamSameNameExist = new TeamSameNameExist(mockTeamRepository);
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

  it('チーム名の一覧を取得(登録がない場合)', async () => {
    const teamSameNameExist = new TeamSameNameExist(mockTeamRepository);
    mockTeamRepository.getAll.mockResolvedValueOnce([]);
    await expect(teamSameNameExist.getTeamNameList()).resolves.toStrictEqual(
      []
    );
  });
});
