import { Identifier } from 'src/__share__/identifier';
import { Member } from '../member/member';
import { MemberStatus } from '../member/member-status';
import { Pair } from '../team/pair';

describe('Pairのテスト', () => {
  it('ペアの名前は1文字でなければならない', () => {
    const id = Identifier.generator();

    const member1 = new Member({
      id: Identifier.generator(),
      name: 'a',
      email: 'a',
      status: MemberStatus.create(),
    });

    const member2 = new Member({
      id: Identifier.generator(),
      name: 'b',
      email: 'b',
      status: MemberStatus.create(),
    });

    expect(
      new Pair({ id: id, name: 'a', memberList: [member1, member2] })
    ).toBeInstanceOf(Pair);
  });

  it('ペアの名前は、a,b,c のような英文字でなければならない', () => {
    const id = Identifier.generator();

    const member1 = new Member({
      id: Identifier.generator(),
      name: 'a',
      email: 'a',
      status: MemberStatus.create(),
    });

    const member2 = new Member({
      id: Identifier.generator(),
      name: 'b',
      email: 'b',
      status: MemberStatus.create(),
    });

    expect(
      () => new Pair({ id: id, name: '1', memberList: [member1, member2] })
    ).toThrowError();
  });

  it('1名のペアは存在できない', () => {
    const id = Identifier.generator();

    const member1 = new Member({
      id: Identifier.generator(),
      name: 'a',
      email: 'a',
      status: MemberStatus.create(),
    });

    expect(
      () => new Pair({ id: id, name: 'a', memberList: [member1] })
    ).toThrowError();
  });

  it('4名のペアは存在できない', () => {
    const id = Identifier.generator();

    const member1 = new Member({
      id: Identifier.generator(),
      name: 'a',
      email: 'a',
      status: MemberStatus.create(),
    });

    const member2 = new Member({
      id: Identifier.generator(),
      name: 'b',
      email: 'b',
      status: MemberStatus.create(),
    });

    const member3 = new Member({
      id: Identifier.generator(),
      name: 'c',
      email: 'c',
      status: MemberStatus.create(),
    });

    const member4 = new Member({
      id: Identifier.generator(),
      name: 'd',
      email: 'd',
      status: MemberStatus.create(),
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
});
