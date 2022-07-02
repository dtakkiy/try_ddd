import { PairNameVO } from '../pair-name-vo';

describe('pair-name-voのテスト', () => {
  it('インスタンスが生成できる', () => {
    expect(new PairNameVO('a')).toBeInstanceOf(PairNameVO);
  });

  it('ペアの名前を取得できる', () => {
    expect(new PairNameVO('a').getName()).toMatch(/a/);
  });

  it('不正な名前を入力した場合', () => {
    expect(() => new PairNameVO('1')).toThrow();
  });
});
