import { PrismaClient } from '@prisma/client';
import { mocked } from 'ts-jest/utils';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import * as faker from 'faker';
import { UpdateTaskStatusUseCase } from '../update-task-status-usecase';
import { ProgressRepository } from 'src/infra/db/repository/progress-repository';
import { Progress } from 'src/domain/progress';
import {
  ProgressStatus,
  ProgressStatusType,
} from 'src/domain/progress-status-vo';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/progress-repository');

describe('【ユースケース】課題進捗の更新', () => {
  let mockProgressRepository: MockedObjectDeep<ProgressRepository>;
  let memberId: string;
  let taskId: string;

  beforeAll(() => {
    const prisma = new PrismaClient();
    mockProgressRepository = mocked(new ProgressRepository(prisma), true);
    memberId = faker.datatype.uuid();
    taskId = faker.datatype.uuid();
  });

  it('【正常系】特定の参加者の課題進捗ステータスを変更できる', () => {
    const progress = new Progress({
      memberId: memberId,
      taskId: taskId,
      status: new ProgressStatus(ProgressStatusType.notStarted),
    });

    const updateProgress = new Progress({
      memberId: memberId,
      taskId: taskId,
      status: new ProgressStatus(ProgressStatusType.awaitingReview),
    });

    mockProgressRepository.getById.mockResolvedValueOnce(progress);
    mockProgressRepository.update.mockResolvedValueOnce(updateProgress);

    const params = {
      memberId: memberId,
      taskId: taskId,
    };

    const usecase = new UpdateTaskStatusUseCase(mockProgressRepository);
    return expect(usecase.execute(params)).resolves.toBe(updateProgress);
  });
});
