import { PrismaClient } from '@prisma/client';
import * as faker from 'faker';
import { DomainError, Result } from 'src/__shared__/result';
import { MemberFactory } from '../domain-service/member-factory';
import { TeamMemberUpdate } from '../domain-service/team-member-update';
import { Member } from '../member';
import { Pair } from '../pair';
import { PairNameVO } from '../pair-name-vo';
import { Team } from '../team';
import { TeamNameVO } from '../team-name-vo';

jest.mock('@prisma/client');

describe('team-member-updateのテスト', () => {
  let teamMemberUpdate: TeamMemberUpdate;

  let teamId: string;
  let team: Result<Team, DomainError>;
  let pair1: Result<Pair, DomainError>;
  let pair2: Result<Pair, DomainError>;
  let member1: Member | null;

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
    team = Team.create({
      id: teamId,
      name: new TeamNameVO('1'),
      pairList: [pair1.value, pair2.value],
    });

    if (team.isFailure()) {
      return;
    }
  });

  it('インスタンス生成', () => {
    expect(teamMemberUpdate).toBeInstanceOf(TeamMemberUpdate);
  });

  it('updateを実行', async () => {
    if (team.isFailure()) {
      return;
    }

    if (member1 === null) {
      return;
    }

    const props = {
      team: team.value,
      member: member1,
    };

    teamMemberUpdate.update(props);

    await expect(teamMemberUpdate.update(props)).rejects.toThrow();
  });
});
