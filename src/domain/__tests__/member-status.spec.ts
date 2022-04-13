import { MemberStatusVO, MemberStatusType } from '../member-status-vo';

describe('member-statusのテスト', () => {
  it('在籍中でインスタンスを作成する', () => {
    const status = new MemberStatusVO(MemberStatusType.active);
    expect(status).toBeInstanceOf(MemberStatusVO);
    expect(status.getStatus()).toMatch(MemberStatusType.active);
  });

  it('休会中でインスタンスを作成する', () => {
    const status = new MemberStatusVO(MemberStatusType.closed);
    expect(status).toBeInstanceOf(MemberStatusVO);
    expect(status.getStatus()).toMatch(MemberStatusType.closed);
  });

  it('退会済でインスタンスを作成する', () => {
    const status = new MemberStatusVO(MemberStatusType.ended);
    expect(status).toBeInstanceOf(MemberStatusVO);
    expect(status.getStatus()).toMatch(MemberStatusType.ended);
  });

  it('規定のステータス値以外で生成できないこと', () => {
    expect(() => new MemberStatusVO('転籍中')).toThrowError();
  });
});
