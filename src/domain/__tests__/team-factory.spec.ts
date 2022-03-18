import * as faker from 'faker';
import { MemberFactory } from '../member/member-factory';
import { Pair } from '../team/pair';
import { Team } from '../team/team';
import { TeamFactory } from '../team/team-factory';

describe('team factoryのテスト', () => {
  it('正常系', () => {
    const member1 = MemberFactory.execute({ name: 'a', email: 'a' });
    const member2 = MemberFactory.execute({
      name: 'b',
      email: 'b',
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
