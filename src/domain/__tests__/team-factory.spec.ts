import * as faker from 'faker';
import { Identifier } from 'src/__shared__/identifier';
import { Pair } from '../team/pair';
import { PairNameVO } from '../team/pair-name-vo';
import { Team } from '../team/team';
import { TeamFactory } from '../team/team-factory';

describe('team factoryのテスト', () => {
  it('正常系', () => {
    const memberId1 = Identifier.generator();
    const memberId2 = Identifier.generator();

    const pairData = {
      id: faker.datatype.uuid(),
      name: new PairNameVO('b'),
      memberIdList: [memberId1, memberId2],
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
