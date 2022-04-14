import { PrismaClient } from '@prisma/client';
import * as faker from 'faker';
import { Team } from '../team';
import { Pair } from '../pair';
import { PairNameVO } from '../pair-name-vo';
import { TeamNameVO } from '../team-name-vo';
import { MemberFactory } from '../domain-service/member-factory';
import { TeamMemberUpdate } from '../domain-service/team-member-update';
import { Member } from '../member';

jest.mock('@prisma/client');

describe('team-member-updateのテスト', () => {
  let teamMemberUpdate: TeamMemberUpdate;

  let teamId: string;
  let team: Team;
  let pair1: Pair;
  let pair2: Pair;
  let teamId2: string;
  let team2: Team;
  let teamId3: string;
  let team3: Team;
  let member1: Member;

  beforeAll(() => {
    const prisma = new PrismaClient();
    teamMemberUpdate = new TeamMemberUpdate(prisma);
  });

  beforeEach(() => {
    member1 = MemberFactory.execute({
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
    expect(teamMemberUpdate).toBeInstanceOf(TeamMemberUpdate);
  });

  it('updateを実行', async () => {
    const props = {
      team: team,
      member: member1,
    };
    await expect(teamMemberUpdate.update(props)).rejects.toThrowError();
  });
});
