import { PrismaClient } from '@prisma/client';
import * as faker from 'faker';
import { Identifier } from 'src/__shared__/identifier';
import { DomainError, Result } from 'src/__shared__/result';
import { Member } from 'src/domain/member';
import { MemberEmailVO } from 'src/domain/member-email-vo';
import { MemberNameVO } from 'src/domain/member-name-vo';
import { MemberStatusVO } from 'src/domain/member-status-vo';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { TeamSameNameExist } from '../../domain-service/team-same-name-exist';
import { Pair } from '../../pair';
import { PairNameVO } from '../../pair-name-vo';
import { Team } from '../../team';
import { TeamNameVO } from '../../team-name-vo';

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
    const member1 = Member.create({
      id: Identifier.generator(),
      name: new MemberNameVO('a'),
      email: new MemberEmailVO('a@example.com'),
      status: MemberStatusVO.create(),
    });
    const member2 = Member.create({
      id: Identifier.generator(),
      name: new MemberNameVO('b'),
      email: new MemberEmailVO('b@example.com'),
      status: MemberStatusVO.create(),
    });
    const member3 = Member.create({
      id: Identifier.generator(),
      name: new MemberNameVO('c'),
      email: new MemberEmailVO('c@example.com'),
      status: MemberStatusVO.create(),
    });
    const member4 = Member.create({
      id: Identifier.generator(),
      name: new MemberNameVO('d'),
      email: new MemberEmailVO('d@example.com'),
      status: MemberStatusVO.create(),
    });
    const member5 = Member.create({
      id: Identifier.generator(),
      name: new MemberNameVO('e'),
      email: new MemberEmailVO('e@example.com'),
      status: MemberStatusVO.create(),
    });

    const member6 = Member.create({
      id: Identifier.generator(),
      name: new MemberNameVO('f'),
      email: new MemberEmailVO('f@example.com'),
      status: MemberStatusVO.create(),
    });

    if (
      member1.isFailure() ||
      member2.isFailure() ||
      member3.isFailure() ||
      member4.isFailure() ||
      member5.isFailure() ||
      member6.isFailure()
    ) {
      return;
    }

    pair1 = Pair.create({
      id: faker.datatype.uuid(),
      name: new PairNameVO('a'),
      memberIdList: [member1.value.id, member2.value.id, member3.value.id],
    });

    if (pair1.isFailure()) {
      return;
    }

    pair2 = Pair.create({
      id: faker.datatype.uuid(),
      name: new PairNameVO('b'),
      memberIdList: [member4.value.id, member5.value.id, member6.value.id],
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
