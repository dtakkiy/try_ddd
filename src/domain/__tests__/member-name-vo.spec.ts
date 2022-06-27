import { MemberNameVO } from '../member-name-vo';

describe('memberNameVOのテスト', () => {
  it('インスタンスが生成できること', () => {
    expect(new MemberNameVO('bob')).toBeInstanceOf(MemberNameVO);
  });

  it('空の文字列を渡した場合', () => {
    expect(() => new MemberNameVO('')).toThrow();
  });
});
