import { PairNameVO } from '../pair-name-vo';

describe('pair-name-voのテスト', () => {
  it('インスタンスが生成できる', () => {
    expect(new PairNameVO('a')).toBeInstanceOf(PairNameVO);
  });

  it('不正な名前を入力した場合', () => {
    expect(() => new PairNameVO('1')).toThrowError();
  });
});
