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

  it('ペアに参加しているか?', () => {
    const status = new MemberStatusVO(MemberStatusType.active);
    expect(status.isJoinPair()).toBeTruthy();
  });

  it('ペアに参加していないか？', () => {
    const status1 = new MemberStatusVO(MemberStatusType.closed);
    expect(status1.isJoinPair()).not.toBeTruthy();

    const status2 = new MemberStatusVO(MemberStatusType.ended);
    expect(status2.isJoinPair()).not.toBeTruthy();
  });

  it('在籍中か?', () => {
    expect(MemberStatusVO.isActiveStatus('在籍中')).toBeTruthy();
    expect(MemberStatusVO.isActiveStatus('休会中')).not.toBeTruthy();
  });

  it('休会中もしくは退会済ステータスである', () => {
    expect(MemberStatusVO.isClosedOrEndedStatus('休会中')).toBeTruthy();
    expect(MemberStatusVO.isClosedOrEndedStatus('退会済')).toBeTruthy();
  });
});
