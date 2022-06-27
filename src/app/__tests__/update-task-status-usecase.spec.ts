import { PrismaClient } from '@prisma/client';
import * as faker from 'faker';
import { Progress } from 'src/domain/progress';
import {
  ProgressStatusVO,
  ProgressStatusType,
} from 'src/domain/progress-status-vo';
import { ProgressRepository } from 'src/infra/db/repository/progress-repository';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { UpdateTaskStatusUseCase } from '../update-task-status-usecase';

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
      status: new ProgressStatusVO(ProgressStatusType.notStarted),
    });

    const updateProgress = new Progress({
      memberId: memberId,
      taskId: taskId,
      status: new ProgressStatusVO(ProgressStatusType.awaitingReview),
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
