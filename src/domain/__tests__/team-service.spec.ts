import { PrismaClient } from '@prisma/client';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import * as faker from 'faker';
import { Team } from '../team';
import { Pair } from '../pair';
import { PairNameVO } from '../pair-name-vo';
import { TeamNameVO } from '../team-name-vo';
import { MemberFactory } from '../domain-service/member-factory';
import { TeamService } from '../domain-service/team-service';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/team-repository');

describe('team-serviceのテスト', () => {
  let mockTeamRepository: MockedObjectDeep<TeamRepository>;
  let teamId: string;
  let team: Team;
  let pair1: Pair;
  let pair2: Pair;
  let teamId2: string;
  let team2: Team;

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

    pair1 = new Pair({
      id: faker.datatype.uuid(),
      name: new PairNameVO('a'),
      memberIdList: [member1.id, member2.id, member3.id],
    });

    pair2 = new Pair({
      id: faker.datatype.uuid(),
      name: new PairNameVO('b'),
      memberIdList: [member4.id, member5.id],
    });

    const pair3 = new Pair({
      id: faker.datatype.uuid(),
      name: new PairNameVO('a'),
      memberIdList: [member1.id, member2.id],
    });

    const pair4 = new Pair({
      id: faker.datatype.uuid(),
      name: new PairNameVO('b'),
      memberIdList: [member4.id, member5.id],
    });

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
      pairList: [pair3, pair4],
    });
  });

  it('インスタンス生成', () => {
    expect(new TeamService(mockTeamRepository)).toBeInstanceOf(TeamService);
  });

  it('もっとも参加者が少ないチームを取得', async () => {
    const teamService = new TeamService(mockTeamRepository);
    mockTeamRepository.getAll.mockResolvedValueOnce([team, team2]);
    await expect(teamService.getTeamFewestNumberOfMember()).resolves.toBe(
      team2
    );
  });

  it('もっとも参加者が少ないペアを取得', async () => {
    const teamService = new TeamService(mockTeamRepository);
    mockTeamRepository.getById.mockResolvedValueOnce(team);
    await expect(teamService.getPairFewestNumberOfMember(teamId)).resolves.toBe(
      pair2
    );

    mockTeamRepository.getById.mockResolvedValueOnce(team);
    await expect(
      teamService.getPairFewestNumberOfMember(teamId)
    ).resolves.not.toBe(pair1);
  });

  it('新しいペア名を生成する', async () => {
    const teamService = new TeamService(mockTeamRepository);
    mockTeamRepository.getById.mockResolvedValueOnce(team);
    await expect(teamService.generateNewPairName(teamId)).resolves.toBe('c');
  });

  it('新しいチーム名を生成する', async () => {
    const teamService = new TeamService(mockTeamRepository);
    mockTeamRepository.getAll.mockResolvedValueOnce([team]);
    await expect(teamService.generateNewTeamName()).resolves.toBe('2');
  });
});
