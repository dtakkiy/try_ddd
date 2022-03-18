import { Identifier } from 'src/__share__/identifier';
import { Member } from '../member/member';
import { MemberStatus } from '../member/member-status';
import { Pair } from '../team/pair';
import * as faker from 'faker';
import { MemberFactory } from '../member/member-factory';
import { MemberNameVO } from '../member/member-name-vo';
import { MemberEmailVO } from '../member/member-email-vo';

describe('Pairのテスト', () => {
  it('ペアの名前は1文字でなければならない', () => {
    const id = Identifier.generator();
    const member1 = MemberFactory.execute({
      name: 'a',
      email: 'a@example.com',
    });
    const member2 = MemberFactory.execute({
      name: 'c',
      email: 'c@example.com',
    });

    expect(
      new Pair({ id: id, name: 'a', memberList: [member1, member2] })
    ).toBeInstanceOf(Pair);
  });

  it('ペアの名前は、a,b,c のような英文字でなければならない', () => {
    const id = Identifier.generator();
    const member1 = MemberFactory.execute({
      name: 'a',
      email: 'a@example.com',
    });
    const member2 = MemberFactory.execute({
      name: 'c',
      email: 'c@example.com',
    });

    expect(
      () => new Pair({ id: id, name: '1', memberList: [member1, member2] })
    ).toThrowError();
  });

  it('1名のペアは存在できない', () => {
    const id = Identifier.generator();
    const member1 = MemberFactory.execute({
      name: 'c',
      email: 'c@example.com',
    });

    expect(
      () => new Pair({ id: id, name: 'a', memberList: [member1] })
    ).toThrowError();
  });

  it('4名のペアは存在できない', () => {
    const id = Identifier.generator();
    const member1 = MemberFactory.execute({
      name: 'a',
      email: 'a@example.com',
    });
    const member2 = MemberFactory.execute({
      name: 'b',
      email: 'b@example.com',
    });
    const member3 = MemberFactory.execute({
      name: 'c',
      email: 'c@example.com',
    });
    const member4 = MemberFactory.execute({
      name: 'd',
      email: 'd@example.com',
    });

    expect(
      () =>
        new Pair({
          id: id,
          name: 'a',
          memberList: [member1, member2, member3, member4],
        })
    ).toThrowError();
  });

  it('3名のペアにメンバーを加えることはできない', () => {
    const member1 = MemberFactory.execute({
      name: 'a',
      email: 'a@example.com',
    });
    const member2 = MemberFactory.execute({
      name: 'b',
      email: 'b@example.com',
    });
    const member3 = MemberFactory.execute({
      name: 'c',
      email: 'c@example.com',
    });

    const pairData = {
      id: faker.datatype.uuid(),
      name: 'b',
      memberList: [member1, member2, member3],
    };

    const pair = new Pair(pairData);
    expect(pair).toBeInstanceOf(Pair);

    const member4 = MemberFactory.execute({
      name: 'd',
      email: 'd@example.com',
    });

    expect(() => pair.addMember(member4)).toThrowError();
  });

  it('ペアのメンバー数を取得することができる', () => {
    const member1 = MemberFactory.execute({
      name: 'a',
      email: 'a@example.com',
    });
    const member2 = MemberFactory.execute({
      name: 'b',
      email: 'b@example.com',
    });

    const pairData = {
      id: faker.datatype.uuid(),
      name: 'b',
      memberList: [member1, member2],
    };

    const pair = new Pair(pairData);
    expect(pair.getMemberCount()).toBe(2);

    const member3 = new Member({
      id: faker.datatype.uuid(),
      name: new MemberNameVO('c'),
      email: new MemberEmailVO('c@example.com'),
      status: MemberStatus.create(),
    });

    pair.addMember(member3);
    expect(pair.getMemberCount()).toBe(3);
  });

  it('メンバーを削除できる', () => {
    const member1 = MemberFactory.execute({
      name: 'a',
      email: 'a@example.com',
    });
    const member2 = MemberFactory.execute({
      name: 'b',
      email: 'b@example.com',
    });

    const deleteMemberId = faker.datatype.uuid();
    const member3 = new Member({
      id: deleteMemberId,
      name: new MemberNameVO('c'),
      email: new MemberEmailVO('c@example.com'),
      status: MemberStatus.create(),
    });

    const pairData = {
      id: faker.datatype.uuid(),
      name: 'b',
      memberList: [member1, member2, member3],
    };

    const pair = new Pair(pairData);
    expect(pair.getMemberCount()).toBe(3);

    pair.deleteMember(deleteMemberId);
    expect(pair.getMemberCount()).toBe(2);
  });
});
