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
import { TeamService } from '../../domain-service/team-service';
import { Pair } from '../../pair';
import { PairNameVO } from '../../pair-name-vo';
import { Team } from '../../team';
import { TeamNameVO } from '../../team-name-vo';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/team-repository');

describe('team-serviceのテスト', () => {
  let mockTeamRepository: MockedObjectDeep<TeamRepository>;
  let teamId: string;
  let team: Team;
  let pair1: Result<Pair, DomainError>;
  let pair2: Result<Pair, DomainError>;
  let teamId2: string;
  let team2: Team;

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

    if (
      member1.isFailure() ||
      member2.isFailure() ||
      member3.isFailure() ||
      member4.isFailure() ||
      member5.isFailure()
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
      memberIdList: [member4.value.id, member5.value.id],
    });

    if (pair2.isFailure()) {
      return;
    }

    const pair3 = Pair.create({
      id: faker.datatype.uuid(),
      name: new PairNameVO('a'),
      memberIdList: [member1.value.id, member2.value.id],
    });

    if (pair3.isFailure()) {
      return;
    }

    const pair4 = Pair.create({
      id: faker.datatype.uuid(),
      name: new PairNameVO('b'),
      memberIdList: [member4.value.id, member5.value.id],
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

    if (pair2.isFailure()) {
      return;
    }

    mockTeamRepository.getById.mockResolvedValueOnce(team);
    await expect(teamService.getPairFewestNumberOfMember(teamId)).resolves.toBe(
      pair2.value
    );

    if (pair1.isFailure()) {
      return;
    }

    mockTeamRepository.getById.mockResolvedValueOnce(team);
    await expect(
      teamService.getPairFewestNumberOfMember(teamId)
    ).resolves.not.toBe(pair1.value);
  });

  it('新しいペア名を生成する', async () => {
    const teamService = new TeamService(mockTeamRepository);
    mockTeamRepository.getById.mockResolvedValueOnce(team);
    await expect(teamService.createNewPairName(teamId)).resolves.toBe('c');
  });

  it('新しいチーム名を生成する', async () => {
    const teamService = new TeamService(mockTeamRepository);
    mockTeamRepository.getAll.mockResolvedValueOnce([team]);
    const result = await teamService.createNewTeamName();

    if (result.isFailure()) {
      return;
    }

    expect(result.value).toBe('2');
  });
});
