import { Pair } from '../team/pair';
import { PairFactory } from '../team/pair-factory';
import * as faker from 'faker';
import { MemberFactory } from '../member/member-factory';

describe('pair factoryのテスト', () => {
  it('正常系', () => {
    const member1 = MemberFactory.execute({
      name: faker.name.firstName(),
      email: faker.internet.email(),
    });

    const member2 = MemberFactory.execute({
      name: faker.name.firstName(),
      email: faker.internet.email(),
    });

    const data = {
      id: faker.datatype.uuid(),
      name: 'a',
      memberList: [member1, member2],
    };

    expect(PairFactory.execute(data)).toBeInstanceOf(Pair);
  });
});
