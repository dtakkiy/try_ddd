import { ProgressStatusVO, ProgressStatusType } from '../progress-status-vo';

describe('progress-statusのテスト', () => {
  it('未着手でインスタンスを作成する', () => {
    const status = new ProgressStatusVO(ProgressStatusType.notStarted);
    expect(status).toBeInstanceOf(ProgressStatusVO);
    expect(status.getStatus()).toMatch(ProgressStatusType.notStarted);
  });

  it('レビュー待ちでインスタンスを作成する', () => {
    const status = new ProgressStatusVO(ProgressStatusType.awaitingReview);
    expect(status).toBeInstanceOf(ProgressStatusVO);
    expect(status.getStatus()).toMatch(ProgressStatusType.awaitingReview);
  });

  it('完了でインスタンスを作成する', () => {
    const status = new ProgressStatusVO(ProgressStatusType.completed);
    expect(status).toBeInstanceOf(ProgressStatusVO);
    expect(status.getStatus()).toMatch(ProgressStatusType.completed);
  });

  it('ステータスが完了か？', () => {
    const status = new ProgressStatusVO(ProgressStatusType.completed);
    expect(status).toBeInstanceOf(ProgressStatusVO);
    expect(status.isComplete()).toBeTruthy();
  });

  it('ステータスが完了以外の場合', () => {
    const status = new ProgressStatusVO(ProgressStatusType.awaitingReview);
    expect(status).toBeInstanceOf(ProgressStatusVO);
    expect(status.isComplete()).not.toBeTruthy();
  });

  it('規定のステータス値以外で生成できないこと', () => {
    expect(() => new ProgressStatusVO('レビュー完了！！！！')).toThrow();
  });
});
