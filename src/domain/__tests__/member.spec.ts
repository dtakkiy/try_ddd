import * as faker from 'faker';
import { Member } from '../member';
import { MemberEmailVO } from '../member-email-vo';
import { MemberNameVO } from '../member-name-vo';
import { MemberStatusVO } from '../member-status-vo';

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
    const member = Member.create(data);
    if (member.isFailure()) {
      return;
    }

    expect(member.value).toBeInstanceOf(Member);
  });

  it('reconstructメソッドからMemberエンティティを生成できる', () => {
    expect(Member.reconstruct(data)).toBeInstanceOf(Member);
  });

  it('memberエンティティは、属性に名前とメールアドレスをもつ', () => {
    const member = Member.create(data);
    if (member.isFailure()) {
      return;
    }
    const { name, email } = member.value.getAllProperties();

    expect(name).toMatch(/bob/);
    expect(email).toMatch(/bob@example.com/);
  });

  it('memberの全てのプロパティを取得できる', () => {
    const member = Member.create(data);
    if (member.isFailure()) {
      return;
    }
    const { id, name, email, status } = member.value.getAllProperties();

    expect(memberId).toBe(id);
    expect(name).toBe('bob');
    expect(email).toBe('bob@example.com');
    expect(status).toBe('在籍中');
  });
});
