import * as faker from 'faker';
import { Member } from '../member';
import { MemberFactory } from '../domain-service/member-factory';

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
