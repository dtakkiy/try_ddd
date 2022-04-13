import { Pair } from '../pair';
import { PairFactory } from '../domain-service/pair-factory';
import * as faker from 'faker';
import { Identifier } from 'src/__shared__/identifier';

describe('pair factoryのテスト', () => {
  it('正常系', () => {
    const memberId1 = Identifier.generator();
    const memberId2 = Identifier.generator();

    const data = {
      id: faker.datatype.uuid(),
      name: 'a',
      memberIdList: [memberId1, memberId2],
    };

    expect(PairFactory.execute(data)).toBeInstanceOf(Pair);
  });
});
