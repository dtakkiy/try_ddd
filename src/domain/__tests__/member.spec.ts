import { Identifier } from 'src/__shared__/identifier';
import { Member } from '../member/member';
import { MemberEmailVO } from '../member/member-email-vo';
import { MemberNameVO } from '../member/member-name-vo';
import { MemberStatus } from '../member/member-status';

describe('', () => {
  it('memberエンティティを生成できる', () => {
    const data = {
      id: Identifier.generator(),
      name: new MemberNameVO('bob'),
      email: new MemberEmailVO('bob@example.com'),
      status: MemberStatus.create(),
    };

    const member = new Member(data);
    expect(member).toBeInstanceOf(Member);
  });

  it('memberエンティティは、属性に名前とメールアドレスをもつ', () => {
    const data = {
      id: Identifier.generator(),
      name: new MemberNameVO('bob'),
      email: new MemberEmailVO('bob@example.com'),
      status: MemberStatus.create(),
    };

    const member = new Member(data);
    expect(member.name.getValue()).toMatch(/bob/);
    expect(member.email.getEmail()).toMatch(/bob@example.com/);
  });
});
