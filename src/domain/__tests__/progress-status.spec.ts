import {
  ProgressStatus,
  ProgressStatusType,
} from '../progress/progress-status';

describe('progress-statusのテスト', () => {
  it('未着手でインスタンスを作成する', () => {
    const status = new ProgressStatus(ProgressStatusType.notStarted);
    expect(status).toBeInstanceOf(ProgressStatus);
    expect(status.getStatus()).toMatch(ProgressStatusType.notStarted);
  });

  it('レビュー待ちでインスタンスを作成する', () => {
    const status = new ProgressStatus(ProgressStatusType.awaitingReview);
    expect(status).toBeInstanceOf(ProgressStatus);
    expect(status.getStatus()).toMatch(ProgressStatusType.awaitingReview);
  });

  it('完了でインスタンスを作成する', () => {
    const status = new ProgressStatus(ProgressStatusType.completed);
    expect(status).toBeInstanceOf(ProgressStatus);
    expect(status.getStatus()).toMatch(ProgressStatusType.completed);
  });

  it('規定のステータス値以外で生成できないこと', () => {
    expect(() => new ProgressStatus('レビュー完了！！！！')).toThrowError();
  });

  it('未着手で進捗を進めた場合、レビュー待ちになる', () => {
    const status = new ProgressStatus(ProgressStatusType.notStarted);
    const updateStatus = status.stepUp();
    expect(updateStatus.getStatus()).toMatch(/レビュー待ち/);
  });

  it('レビュー待ちで進捗を進めた場合、完了になる', () => {
    const status = new ProgressStatus(ProgressStatusType.awaitingReview);
    const udpateStatus = status.stepUp();
    expect(udpateStatus.getStatus()).toMatch(/完了/);
  });

  it('ステータスが完了の場合、エラーとなる', () => {
    const status = new ProgressStatus(ProgressStatusType.completed);
    expect(() => status.stepUp()).toThrowError();
  });
});
