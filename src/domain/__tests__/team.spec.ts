import * as faker from 'faker';
import { Identifier } from 'src/__shared__/identifier';
import { Pair } from '../pair';
import { PairNameVO } from '../pair-name-vo';
import { Team } from '../team';
import { TeamNameVO } from '../team-name-vo';

describe('Teamエンティティのテスト', () => {
  let memberId1: string;
  let memberId2: string;
  let memberId3: string;
  let memberId4: string;
  let memberId5: string;

  let pairId1: string;
  let pairId2: string;

  beforeEach(() => {
    memberId1 = faker.datatype.uuid();
    memberId2 = faker.datatype.uuid();
    memberId3 = faker.datatype.uuid();
    memberId4 = faker.datatype.uuid();
    memberId5 = faker.datatype.uuid();

    pairId1 = faker.datatype.uuid();
    pairId2 = faker.datatype.uuid();
  });

  describe('チームの名前', () => {
    it('名前が数字の場合', () => {
      const team = Team.create({
        id: Identifier.generator(),
        name: new TeamNameVO('123'),
        pairList: [],
      });

      if (team.isFailure()) {
        return;
      }

      expect(team.value).toBeInstanceOf(Team);
    });

    it('名前が数字以外の場合', () => {
      expect(() => {
        Team.create({
          id: Identifier.generator(),
          name: new TeamNameVO('a'),
          pairList: [],
        });
      }).toThrow();
    });

    it('名前は3文字以下でないといけない', () => {
      const id = Identifier.generator();
      expect(() => {
        Team.create({
          id: id,
          name: new TeamNameVO('1234'),
          pairList: [],
        });
      }).toThrow();
    });
  });

  describe('チームの最小人数のペア', () => {
    it('メンバーが少ないペアを特定する', () => {
      const pair1 = Pair.create({
        id: pairId1,
        name: new PairNameVO('a'),
        memberIdList: [memberId1, memberId2, memberId5],
      });

      if (pair1.isFailure()) {
        return;
      }

      const pair2 = Pair.create({
        id: pairId2,
        name: new PairNameVO('b'),
        memberIdList: [memberId3, memberId4],
      });

      if (pair2.isFailure()) {
        return;
      }

      const team = Team.create({
        id: faker.datatype.uuid(),
        name: new TeamNameVO('1'),
        pairList: [pair1.value, pair2.value],
      });

      if (team.isFailure()) {
        return;
      }

      const minMemberPair = team.value.getMinMemberPair();
      expect(minMemberPair.getName()).toMatch(/b/);
    });
  });

  describe('チームの人数', () => {
    it('チームの人数をカウントする', () => {
      const pair = Pair.create({
        id: pairId1,
        name: new PairNameVO('a'),
        memberIdList: [memberId1, memberId2, memberId3],
      });

      if (pair.isFailure()) {
        return;
      }

      const team = Team.create({
        id: faker.datatype.uuid(),
        name: new TeamNameVO('1'),
        pairList: [pair.value],
      });

      if (team.isFailure()) {
        return;
      }

      expect(team.value.getMemberCount()).toBe(3);
    });

    it('チームにメンバーを追加する', () => {
      const pair = Pair.create({
        id: pairId1,
        name: new PairNameVO('a'),
        memberIdList: [memberId1, memberId2],
      });

      if (pair.isFailure()) {
        return;
      }

      const team = Team.create({
        id: faker.datatype.uuid(),
        name: new TeamNameVO('1'),
        pairList: [pair.value],
      });

      if (team.isFailure()) {
        return;
      }

      expect(team.value.getMemberCount()).toBe(2);
      team.value.addMember(memberId3);
      expect(team.value.getMemberCount()).toBe(3);
    });

    // it('チームメンバー数が最大数を超えた場合', () => {
    //   const pair = new Pair({
    //     id: pairId1,
    //     name: new PairNameVO('a'),
    //     memberIdList: [memberId1, memberId2, memberId3],
    //   });

    //   const team = new Team({
    //     id: faker.datatype.uuid(),
    //     name: new TeamNameVO('1'),
    //     pairList: [pair],
    //   });

    //   expect(team.getMemberCount()).toBe(3);
    //   expect(() => team.addMember(memberId4)).toThrow();
    // });

    it('チームメンバーを削除した際、最少人数を下回った場合', () => {
      const pair = Pair.create({
        id: pairId1,
        name: new PairNameVO('a'),
        memberIdList: [memberId1, memberId2, memberId3],
      });

      if (pair.isFailure()) {
        return;
      }

      const team = Team.create({
        id: faker.datatype.uuid(),
        name: new TeamNameVO('1'),
        pairList: [pair.value],
      });

      if (team.isFailure()) {
        return;
      }

      expect(team.value.getMemberCount()).toBe(3);
      const result = team.value.deleteMember(memberId3);
      expect(result.isFailure()).toBe(true);
    });

    it('チームメンバーを削除', () => {
      const pair1 = Pair.create({
        id: pairId1,
        name: new PairNameVO('a'),
        memberIdList: [memberId1, memberId2],
      });

      if (pair1.isFailure()) {
        return;
      }

      const pair2 = Pair.create({
        id: pairId2,
        name: new PairNameVO('b'),
        memberIdList: [memberId3, memberId4, memberId5],
      });

      if (pair2.isFailure()) {
        return;
      }

      const team = Team.create({
        id: faker.datatype.uuid(),
        name: new TeamNameVO('1'),
        pairList: [pair1.value, pair2.value],
      });

      if (team.isFailure()) {
        return;
      }

      expect(team.value.getMemberCount()).toBe(5);
      team.value.deleteMember(memberId5);
      expect(team.value.getMemberCount()).toBe(4);
    });
  });
});
