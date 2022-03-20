import { Identifier } from 'src/__share__/identifier';
import { Pair } from '../team/pair';
import * as faker from 'faker';
import { PairNameVO } from '../team/pair-name-vo';

describe('Pairのテスト', () => {
  let memberId1: string;
  let memberId2: string;
  let memberId3: string;
  let memberId4: string;

  beforeEach(() => {
    memberId1 = Identifier.generator();
    memberId2 = Identifier.generator();
    memberId3 = Identifier.generator();
    memberId4 = Identifier.generator();
  });

  it('ペアの名前は1文字でなければならない', () => {
    const id = Identifier.generator();
    expect(
      new Pair({
        id: id,
        name: new PairNameVO('a'),
        memberIdList: [memberId1, memberId2],
      })
    ).toBeInstanceOf(Pair);
  });

  it('ペアの名前は、a,b,c のような英文字でなければならない', () => {
    const id = Identifier.generator();
    expect(
      () =>
        new Pair({
          id: id,
          name: new PairNameVO('1'),
          memberIdList: [memberId1, memberId2],
        })
    ).toThrowError();
  });

  it('1名のペアは存在できない', () => {
    const id = Identifier.generator();
    expect(
      () =>
        new Pair({
          id: id,
          name: new PairNameVO('a'),
          memberIdList: [memberId1],
        })
    ).toThrowError();
  });

  it('4名のペアは存在できない', () => {
    const id = Identifier.generator();
    expect(
      () =>
        new Pair({
          id: id,
          name: new PairNameVO('a'),
          memberIdList: [memberId1, memberId2, memberId3, memberId4],
        })
    ).toThrowError();
  });

  it('ペアのメンバー数を取得することができる', () => {
    const pairData = {
      id: faker.datatype.uuid(),
      name: new PairNameVO('b'),
      memberIdList: [memberId1, memberId2],
    };

    const pair = new Pair(pairData);
    expect(pair.getMemberCount()).toBe(2);
    const memberId5 = Identifier.generator();

    pair.addMember(memberId5);
    expect(pair.getMemberCount()).toBe(3);
  });

  it('メンバーを削除できる', () => {
    const memberId5 = Identifier.generator();

    const pairData = {
      id: faker.datatype.uuid(),
      name: new PairNameVO('b'),
      memberIdList: [memberId1, memberId2, memberId5],
    };

    const pair = new Pair(pairData);
    expect(pair.getMemberCount()).toBe(3);

    pair.deleteMember(memberId5);
    expect(pair.getMemberCount()).toBe(2);
  });
});
