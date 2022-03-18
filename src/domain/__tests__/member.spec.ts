import { Identifier } from 'src/__share__/identifier';
import { Member } from '../member/member';
import { MemberEmailVO } from '../member/member-email-vo';
import { MemberStatus } from '../member/member-status';

describe('', () => {
  it('memberエンティティを生成できる', () => {
    const data = {
      id: Identifier.generator(),
      name: 'bob',
      email: new MemberEmailVO('bob@example.com'),
      status: MemberStatus.create(),
    };

    const member = new Member(data);
    expect(member).toBeInstanceOf(Member);
  });

  it('memberエンティティは、属性に名前とメールアドレスをもつ', () => {
    const data = {
      id: Identifier.generator(),
      name: 'bob',
      email: new MemberEmailVO('bob@example.com'),
      status: MemberStatus.create(),
    };

    const member = new Member(data);
    expect(member.name).toMatch(/bob/);
    expect(member.email.getEmail()).toMatch(/bob@example.com/);
  });

  it('名前が空の場合', () => {
    const data = {
      id: Identifier.generator(),
      name: '',
      email: new MemberEmailVO('bob@example.com'),
      status: MemberStatus.create(),
    };

    expect(() => new Member(data)).toThrowError();
  });

  // it('emailが空の場合', () => {
  //   const data = {
  //     id: Identifier.generator(),
  //     name: 'bob',
  //     email: new MemberEmailVO(''),
  //     status: MemberStatus.create(),
  //   };

  //   expect(() => new Member(data)).toThrowError();
  // });

  // メールアドレスの重複は許容しない

  // 在籍ステータスを持つ。在籍ステータスは、在籍中、休会中、退会済みの３つ。

  // ステータスが在籍中ではない場合、どのチームにも所属できない。
});
