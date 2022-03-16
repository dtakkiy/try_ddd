import * as faker from 'faker';
import { Progress } from '../progress/progress';
import {
  ProgressStatus,
  ProgressStatusType,
} from '../progress/progress-status';

describe('progressエンティティのテスト', () => {
  it('エンティティを生成できるか', () => {
    const data = {
      memberId: faker.datatype.uuid(),
      taskId: faker.datatype.uuid(),
      status: new ProgressStatus({ status: ProgressStatusType.notStarted }),
    };
    const progress = new Progress(data);
    expect(progress).toBeInstanceOf(Progress);
  });

  it('進捗ステータスが完了になった場合、戻すことはできない', () => {
    const data = {
      memberId: faker.datatype.uuid(),
      taskId: faker.datatype.uuid(),
      status: new ProgressStatus({ status: ProgressStatusType.completed }),
    };
    const progress = new Progress(data);
    expect(progress.status).toMatch(ProgressStatusType.completed);

    expect(() => progress.changeStatusForward()).toThrowError(
      `already completed.`
    );
  });

  // ステータス変更は、課題の所有者のみ行える
});
