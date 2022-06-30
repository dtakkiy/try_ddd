import * as faker from 'faker';
import { Identifier } from 'src/__shared__/identifier';
import { Pair } from '../pair';
import { PairNameVO } from '../pair-name-vo';

describe('Pairのテスト', () => {
  let memberId1: string;
  let memberId2: string;
  let memberId3: string;
  let memberId4: string;

  beforeEach(() => {
    memberId1 = faker.datatype.uuid();
    memberId2 = faker.datatype.uuid();
    memberId3 = faker.datatype.uuid();
    memberId4 = faker.datatype.uuid();
  });

  it('ペアの名前は1文字でなければならない', () => {
    const id = Identifier.generator();
    expect(
      Pair.create({
        id: id,
        name: new PairNameVO('a'),
        memberIdList: [memberId1, memberId2],
      }).value
    ).toBeInstanceOf(Pair);
  });

  it('ペアの名前は、a,b,c のような英文字でなければならない', () => {
    const id = Identifier.generator();
    expect(() =>
      Pair.create({
        id: id,
        name: new PairNameVO('1'),
        memberIdList: [memberId1, memberId2],
      })
    ).toThrow();
  });

  it('1名のペアは存在できない', () => {
    const id = Identifier.generator();
    expect(
      Pair.create({
        id: id,
        name: new PairNameVO('a'),
        memberIdList: [memberId1],
      }).isFailure()
    ).toBeTruthy();
  });

  it('4名のペアは存在できない', () => {
    const id = Identifier.generator();
    expect(
      Pair.create({
        id: id,
        name: new PairNameVO('a'),
        memberIdList: [memberId1, memberId2, memberId3, memberId4],
      }).isFailure()
    ).toBeTruthy();
  });

  it('メンバーを追加できる', () => {
    const pair = Pair.create({
      id: faker.datatype.uuid(),
      name: new PairNameVO('a'),
      memberIdList: [memberId1, memberId2],
    });

    if (pair.isFailure()) {
      return;
    }

    expect(pair.value.getMemberCount()).toBe(2);
    pair.value.addMember(memberId3);
    expect(pair.value.getMemberCount()).toBe(3);
  });

  it('指定したメンバーが存在するか', () => {
    const pair = Pair.create({
      id: faker.datatype.uuid(),
      name: new PairNameVO('b'),
      memberIdList: [memberId1, memberId2],
    });
    if (pair.isFailure()) {
      return;
    }

    expect(pair.value.isMemberExist(memberId1)).toBe(true);
  });

  it('指定したメンバーが存在しない場合', () => {
    const pair = Pair.create({
      id: faker.datatype.uuid(),
      name: new PairNameVO('b'),
      memberIdList: [memberId1, memberId2],
    });
    if (pair.isFailure()) {
      return;
    }

    expect(pair.value.isMemberExist(memberId4)).toBe(false);
  });

  it('ペアのメンバー数を取得することができる', () => {
    const pairData = {
      id: faker.datatype.uuid(),
      name: new PairNameVO('b'),
      memberIdList: [memberId1, memberId2],
    };

    const pair = Pair.create(pairData);
    if (pair.isFailure()) {
      return;
    }
    expect(pair.value.getMemberCount()).toBe(2);
    const memberId5 = Identifier.generator();

    pair.value.addMember(memberId5);
    expect(pair.value.getMemberCount()).toBe(3);
  });

  it('メンバーを削除できる', () => {
    const memberId5 = Identifier.generator();

    const pairData = {
      id: faker.datatype.uuid(),
      name: new PairNameVO('b'),
      memberIdList: [memberId1, memberId2, memberId5],
    };

    const pair = Pair.create(pairData);
    if (pair.isFailure()) {
      return;
    }
    expect(pair.value.getMemberCount()).toBe(3);

    pair.value.deleteMember(memberId5);
    expect(pair.value.getMemberCount()).toBe(2);
  });
});
