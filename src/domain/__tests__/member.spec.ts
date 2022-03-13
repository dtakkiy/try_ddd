import { Identifier } from 'src/__share__/identifier';
import { Member } from '../member/member';
import { MemberStatus } from '../member/member-status';

describe('', () => {
  it('memberエンティティを生成できる', () => {
    const data = {
      id: Identifier.generator(),
      name: 'bob',
      email: 'bob@example.com',
      status: MemberStatus.create(),
    };

    const member = new Member(data);
    expect(member).toBeInstanceOf(Member);
  });

  it('memberエンティティは、属性に名前とメールアドレスをもつ', () => {
    const data = {
      id: Identifier.generator(),
      name: 'bob',
      email: 'bob@example.com',
      status: MemberStatus.create(),
    };

    const member = new Member(data);
    expect(member.name).toMatch(/bob/);
    expect(member.email).toMatch(/bob@example.com/);
  });

  it('名前が空の場合', () => {
    const data = {
      id: Identifier.generator(),
      name: '',
      email: 'bob@example.com',
      status: MemberStatus.create(),
    };

    expect(() => Member.create(data)).toThrowError();
  });

  it('emailが空の場合', () => {
    const data = {
      id: Identifier.generator(),
      name: 'bob',
      email: '',
      status: MemberStatus.create(),
    };

    expect(() => Member.create(data)).toThrowError();
  });
});
