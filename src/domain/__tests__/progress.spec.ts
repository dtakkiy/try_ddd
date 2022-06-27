import * as faker from 'faker';
import { Progress } from '../progress';
import { ProgressStatusVO, ProgressStatusType } from '../progress-status-vo';

describe('progressエンティティのテスト', () => {
  it('エンティティを生成できるか', () => {
    const data = {
      memberId: faker.datatype.uuid(),
      taskId: faker.datatype.uuid(),
      status: ProgressStatusVO.create(),
    };
    const progress = new Progress(data);
    expect(progress).toBeInstanceOf(Progress);
  });

  it('進捗ステータスを進めることができる', () => {
    const memberId = faker.datatype.uuid();

    const data = {
      memberId: memberId,
      taskId: faker.datatype.uuid(),
      status: new ProgressStatusVO(ProgressStatusType.notStarted),
    };
    const progress = new Progress(data);
    expect(progress.status).toMatch(ProgressStatusType.notStarted);
    progress.changeStatusForward(memberId);
    expect(progress.status).toMatch(ProgressStatusType.awaitingReview);
    progress.changeStatusForward(memberId);
    expect(progress.status).toMatch(ProgressStatusType.completed);
  });

  it('進捗ステータスが完了になった場合、戻すことはできない', () => {
    const memberId = faker.datatype.uuid();

    const data = {
      memberId: memberId,
      taskId: faker.datatype.uuid(),
      status: new ProgressStatusVO(ProgressStatusType.completed),
    };
    const progress = new Progress(data);
    expect(progress.status).toMatch(ProgressStatusType.completed);

    expect(() => progress.changeStatusForward(memberId)).toThrow(
      `already completed.`
    );
  });

  it('ステータス変更は、課題の所有者のみ行える', () => {
    const memberId1 = faker.datatype.uuid();
    const memberId2 = faker.datatype.uuid();

    const data = {
      memberId: memberId1,
      taskId: faker.datatype.uuid(),
      status: new ProgressStatusVO(ProgressStatusType.completed),
    };
    const progress = new Progress(data);
    expect(progress.status).toMatch(ProgressStatusType.completed);

    expect(() => progress.changeStatusForward(memberId2)).toThrow(
      `only the owner can change the task status.`
    );
  });
});
