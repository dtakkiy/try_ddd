import { MemberNameVO } from '../member-name-vo';

describe('memberNameVOのテスト', () => {
  it('インスタンスが生成できること', () => {
    expect(new MemberNameVO('bob')).toBeInstanceOf(MemberNameVO);
  });

  it('空の文字列を渡した場合', () => {
    expect(() => new MemberNameVO('')).toThrow();
  });

  it('メンバー名を取得可能か', () => {
    const memberNameVO = new MemberNameVO('bob');
    expect(memberNameVO.getName()).toMatch(/bob/);
  });
});
