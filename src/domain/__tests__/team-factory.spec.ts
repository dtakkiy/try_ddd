import * as faker from 'faker';
import { Member } from '../member/member';
import { MemberStatus } from '../member/member-status';
import { Pair } from '../team/pair';
import { Team } from '../team/team';
import { TeamFactory } from '../team/team-factory';

describe('team factoryのテスト', () => {
  it('正常系', () => {
    const member1 = new Member({
      id: faker.datatype.uuid(),
      name: 'a',
      email: 'a',
      status: MemberStatus.create(),
    });

    const member2 = new Member({
      id: faker.datatype.uuid(),
      name: 'b',
      email: 'b',
      status: MemberStatus.create(),
    });

    const pairData = {
      id: faker.datatype.uuid(),
      name: 'b',
      memberList: [member1, member2],
    };

    const pair1 = new Pair(pairData);

    const teamData = {
      id: faker.datatype.uuid(),
      name: '1',
      pairList: [pair1],
    };

    expect(TeamFactory.execute(teamData)).toBeInstanceOf(Team);
  });
});
