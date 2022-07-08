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
import { PairSameNameExist } from '../../domain-service/pair-same-name-exists';
import { Pair } from '../../pair';
import { PairNameVO } from '../../pair-name-vo';
import { Team } from '../../team';
import { TeamNameVO } from '../../team-name-vo';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/team-repository');

describe('pair-same-existのテスト', () => {
  let mockTeamRepository: MockedObjectDeep<TeamRepository>;
  let teamId: string;
  let team: Result<Team, DomainError>;
  let pair1: Result<Pair, DomainError>;
  let pair2: Result<Pair, DomainError>;

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
    team = Team.create({
      id: teamId,
      name: new TeamNameVO('1'),
      pairList: [pair1.value, pair2.value],
    });
  });

  it('インスタンス生成', () => {
    const pairSameNameExist = new PairSameNameExist({
      repository: mockTeamRepository,
    });

    expect(pairSameNameExist).toBeInstanceOf(PairSameNameExist);
  });

  it('ペア名が存在するか', async () => {
    if (team.isFailure()) {
      return;
    }

    const pairSameNameExist = new PairSameNameExist({
      repository: mockTeamRepository,
    });
    mockTeamRepository.getById.mockResolvedValueOnce(team.value);

    await expect(
      pairSameNameExist.isPairName('b', teamId)
    ).resolves.toBeTruthy();

    await expect(
      pairSameNameExist.isPairName('c', teamId)
    ).resolves.not.toBeTruthy();
  });

  it('ペア名の一覧を取得', async () => {
    if (team.isFailure()) {
      return;
    }

    const pairSameNameExist = new PairSameNameExist({
      repository: mockTeamRepository,
    });
    mockTeamRepository.getById.mockResolvedValueOnce(team.value);
    await expect(
      pairSameNameExist.getPairNameListByTeamId(teamId)
    ).resolves.toStrictEqual(['a', 'b']);

    mockTeamRepository.getById.mockResolvedValueOnce(team.value);
    await expect(
      pairSameNameExist.getPairNameListByTeamId(teamId)
    ).resolves.not.toStrictEqual(['a', 'b', 'c']);
  });

  it('指定したチームが存在しない場合', async () => {
    const pairSameNameExist = new PairSameNameExist({
      repository: mockTeamRepository,
    });

    await expect(
      pairSameNameExist.getPairNameListByTeamId(teamId)
    ).resolves.toStrictEqual([]);
  });
});
