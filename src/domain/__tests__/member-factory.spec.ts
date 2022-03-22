import * as faker from 'faker';
import { Member } from '../member/member';
import { MemberFactory } from '../member/member-factory';

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
