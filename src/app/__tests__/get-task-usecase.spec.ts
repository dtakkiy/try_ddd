import { PrismaClient } from '@prisma/client';
import { TaskQueryService } from 'src/infra/db/query-service/task-query-service';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { GetTaskUseCase } from '../get-task-usecae';
import * as faker from 'faker';
import { TaskDTO } from '../query-service-interface/task-query-service';

jest.mock('@prisma/client');
jest.mock('src/infra/db/query-service/task-query-service');

describe('課題一覧取得 テスト', () => {
  let mockTaskQS: MockedObjectDeep<TaskQueryService>;
  beforeAll(() => {
    const prisma = new PrismaClient();
    mockTaskQS = mocked(new TaskQueryService(prisma), true);
  });

  it('インスタンスを生成できるか？', async () => {
    const usecase = new GetTaskUseCase(mockTaskQS);
    return await expect(usecase.execute()).resolves.toBe(undefined);
  });

  it('課題を取得できるか？', async () => {
    const task1 = new TaskDTO({
      id: faker.datatype.uuid(),
      title: '課題1',
      content: '本文',
    });
    const task2 = new TaskDTO({
      id: faker.datatype.uuid(),
      title: '課題2',
      content: '本文',
    });

    const data: TaskDTO[] = [task1, task2];

    mockTaskQS.getAll.mockResolvedValueOnce(data);
    const usecase = new GetTaskUseCase(mockTaskQS);
    return await expect(usecase.execute()).resolves.toBe(data);
  });
});
