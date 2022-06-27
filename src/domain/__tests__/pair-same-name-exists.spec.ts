import { PrismaClient } from '@prisma/client';
import * as faker from 'faker';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { MemberFactory } from '../domain-service/member-factory';
import { PairSameNameExist } from '../domain-service/pair-same-name-exists';
import { Pair } from '../pair';
import { PairNameVO } from '../pair-name-vo';
import { Team } from '../team';
import { TeamNameVO } from '../team-name-vo';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/team-repository');

describe('pair-same-existのテスト', () => {
  let mockTeamRepository: MockedObjectDeep<TeamRepository>;
  let teamId: string;
  let team: Team;
  let pair1: Pair;
  let pair2: Pair;

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

    pair1 = new Pair({
      id: faker.datatype.uuid(),
      name: new PairNameVO('a'),
      memberIdList: [member1.id, member2.id, member3.id],
    });

    pair2 = new Pair({
      id: faker.datatype.uuid(),
      name: new PairNameVO('b'),
      memberIdList: [member4.id, member5.id, member6.id],
    });

    teamId = faker.datatype.uuid();
    team = new Team({
      id: teamId,
      name: new TeamNameVO('1'),
      pairList: [pair1, pair2],
    });
  });

  it('インスタンス生成', () => {
    const pairSameNameExist = new PairSameNameExist({
      repository: mockTeamRepository,
    });

    expect(pairSameNameExist).toBeInstanceOf(PairSameNameExist);
  });

  it('ペア名が存在するか', async () => {
    const pairSameNameExist = new PairSameNameExist({
      repository: mockTeamRepository,
    });
    mockTeamRepository.getById.mockResolvedValueOnce(team);

    await expect(
      pairSameNameExist.isPairName('b', teamId)
    ).resolves.toBeTruthy();

    await expect(
      pairSameNameExist.isPairName('c', teamId)
    ).resolves.not.toBeTruthy();
  });

  it('ペア名の一覧を取得', async () => {
    const pairSameNameExist = new PairSameNameExist({
      repository: mockTeamRepository,
    });
    mockTeamRepository.getById.mockResolvedValueOnce(team);

    await expect(
      pairSameNameExist.getPairNameListByTeamId(teamId)
    ).resolves.toStrictEqual(['a', 'b']);

    mockTeamRepository.getById.mockResolvedValueOnce(team);

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
