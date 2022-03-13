import { Identifier } from 'src/__share__/identifier';
import { PairFactory } from '../team/pair-factory';
import { Team } from '../team/team';

describe('Teamエンティティのテスト', () => {
  describe('チームの名前', () => {
    it('名前が数字の場合', () => {
      expect(
        new Team({ id: Identifier.generator(), name: '123', pairList: [] })
      ).toBeInstanceOf(Team);
    });

    it('名前が数字以外の場合', () => {
      const id = Identifier.generator();
      expect(() => {
        new Team({
          id: id,
          name: 'a',
          pairList: [],
        });
      }).toThrowError();
    });

    it('名前は3文字以下でないといけない', () => {
      const id = Identifier.generator();
      expect(() => {
        new Team({ id: id, name: '1234', pairList: [] });
      }).toThrowError();
    });

    // チームの名前は重複不可

    // チームの参加者は、最低3名必要
  });
});
