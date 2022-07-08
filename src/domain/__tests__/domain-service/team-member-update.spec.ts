import { PrismaClient } from '@prisma/client';
import * as faker from 'faker';
import { Identifier } from 'src/__shared__/identifier';
import { DomainError, Result } from 'src/__shared__/result';
import { Member } from 'src/domain/member';
import { MemberEmailVO } from 'src/domain/member-email-vo';
import { MemberNameVO } from 'src/domain/member-name-vo';
import { MemberStatusVO } from 'src/domain/member-status-vo';
import { TeamMemberUpdate } from '../../domain-service/team-member-update';
import { Pair } from '../../pair';
import { PairNameVO } from '../../pair-name-vo';
import { Team } from '../../team';
import { TeamNameVO } from '../../team-name-vo';

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
