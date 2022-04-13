import { MemberEmailVO } from '../member-email-vo';

describe('memberEmailVOのテスト', () => {
  it('インスタンスが生成できること', () => {
    expect(new MemberEmailVO('a@example.com')).toBeInstanceOf(MemberEmailVO);
  });

  it('空のemailアドレスを渡した場合', () => {
    expect(() => new MemberEmailVO('')).toThrowError();
  });

  it('不正なemailアドレスであった場合', () => {
    expect(() => new MemberEmailVO('aaaaaa@aaaaaaaa')).toThrowError();
  });
});
