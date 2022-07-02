import * as faker from 'faker';
import { MemberFactory } from '../../domain-service/member-factory';
import { Member } from '../../member';

describe('member factoryのテスト', () => {
  it('正常系', () => {
    const props = {
      id: faker.datatype.uuid(),
      name: faker.name.firstName(),
      email: faker.internet.email(),
    };

    expect(MemberFactory.execute(props)).toBeInstanceOf(Member);
  });
});
