import { Identifier } from 'src/__shared__/identifier';
import { Member } from '../member';
import { MemberEmailVO } from '../member-email-vo';
import { MemberNameVO } from '../member-name-vo';
import { MemberStatusVO } from '../member-status-vo';

describe('', () => {
  it('memberエンティティを生成できる', () => {
    const data = {
      id: Identifier.generator(),
      name: new MemberNameVO('bob'),
      email: new MemberEmailVO('bob@example.com'),
      status: MemberStatusVO.create(),
    };

    const member = new Member(data);
    expect(member).toBeInstanceOf(Member);
  });

  it('memberエンティティは、属性に名前とメールアドレスをもつ', () => {
    const data = {
      id: Identifier.generator(),
      name: new MemberNameVO('bob'),
      email: new MemberEmailVO('bob@example.com'),
      status: MemberStatusVO.create(),
    };

    const member = new Member(data);
    expect(member.name.getValue()).toMatch(/bob/);
    expect(member.email.getEmail()).toMatch(/bob@example.com/);
  });
});
