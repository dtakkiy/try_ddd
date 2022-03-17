import { Pair } from '../team/pair';
import { PairFactory } from '../team/pair-factory';
import * as faker from 'faker';
import { Member } from '../member/member';
import { MemberStatus } from '../member/member-status';

describe('pair factoryのテスト', () => {
  it('正常系', () => {
    const member1 = new Member({
      id: faker.datatype.uuid(),
      name: faker.name.firstName(),
      email: faker.internet.email(),
      status: MemberStatus.create(),
    });

    const member2 = new Member({
      id: faker.datatype.uuid(),
      name: faker.name.firstName(),
      email: faker.internet.email(),
      status: MemberStatus.create(),
    });

    const data = {
      id: faker.datatype.uuid(),
      name: 'a',
      memberList: [member1, member2],
    };

    expect(PairFactory.execute(data)).toBeInstanceOf(Pair);
  });
});
