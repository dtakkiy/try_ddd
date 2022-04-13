import { MemberStatus, MemberStatusType } from '../member-status-vo';

describe('member-statusのテスト', () => {
  it('在籍中でインスタンスを作成する', () => {
    const status = new MemberStatus(MemberStatusType.active);
    expect(status).toBeInstanceOf(MemberStatus);
    expect(status.getStatus()).toMatch(MemberStatusType.active);
  });

  it('休会中でインスタンスを作成する', () => {
    const status = new MemberStatus(MemberStatusType.closed);
    expect(status).toBeInstanceOf(MemberStatus);
    expect(status.getStatus()).toMatch(MemberStatusType.closed);
  });

  it('退会済でインスタンスを作成する', () => {
    const status = new MemberStatus(MemberStatusType.ended);
    expect(status).toBeInstanceOf(MemberStatus);
    expect(status.getStatus()).toMatch(MemberStatusType.ended);
  });

  it('規定のステータス値以外で生成できないこと', () => {
    expect(() => new MemberStatus('転籍中')).toThrowError();
  });
});
