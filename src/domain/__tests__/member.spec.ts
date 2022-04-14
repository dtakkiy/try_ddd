import { Identifier } from 'src/__shared__/identifier';
import { Member } from '../member';
import { MemberEmailVO } from '../member-email-vo';
import { MemberNameVO } from '../member-name-vo';
import { MemberStatusVO } from '../member-status-vo';
import * as faker from 'faker';

interface IMember {
  id: string;
  name: MemberNameVO;
  email: MemberEmailVO;
  status: MemberStatusVO;
}

describe('memberエンティティのテスト', () => {
  let data: IMember;
  let memberId: string;

  beforeEach(() => {
    memberId = faker.datatype.uuid();
    data = {
      id: memberId,
      name: new MemberNameVO('bob'),
      email: new MemberEmailVO('bob@example.com'),
      status: MemberStatusVO.create(),
    };
  });

  it('memberエンティティを生成できる', () => {
    const member = new Member(data);
    expect(member).toBeInstanceOf(Member);
  });

  it('memberエンティティは、属性に名前とメールアドレスをもつ', () => {
    const member = new Member(data);
    expect(member.name.getValue()).toMatch(/bob/);
    expect(member.email.getEmail()).toMatch(/bob@example.com/);
  });

  it('memberの全てのプロパティを取得できる', () => {
    const member = new Member(data);
    const { id, name, email, status } = member.getAllProperties();
    expect(memberId).toBe(id);
    expect(name).toBe('bob');
    expect(email).toBe('bob@example.com');
    expect(status).toBe('在籍中');
  });
});
