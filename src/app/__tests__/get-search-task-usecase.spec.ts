import { PrismaClient } from '@prisma/client';
import { mocked } from 'ts-jest/utils';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { GetSearchTaskUseCase } from '../get-search-task-usecase';
import { SearchQueryService } from 'src/infra/db/query-service/search-task-query-service';
import * as faker from 'faker';
import { SearchDTO } from '../query-service-interface/search-task-query-service';

jest.mock('@prisma/client');
jest.mock('src/infra/db/query-service/search-task-query-service');

describe('【ユースケース】特定の課題（複数可）が、特定の進捗ステータスになっている参加者一覧を取得する', () => {
  let mockSearchQS: MockedObjectDeep<SearchQueryService>;

  let taskId1: string;
  let taskId2: string;

  beforeAll(() => {
    const prisma = new PrismaClient();
    mockSearchQS = mocked(new SearchQueryService(prisma), true);
  });

  beforeEach(() => {
    taskId1 = faker.datatype.uuid();
    taskId2 = faker.datatype.uuid();
  });

  it('【正常系】特定の課題（複数可）を指定し、参加者一覧を取得できる', async () => {
    const usecase = new GetSearchTaskUseCase(mockSearchQS);

    const taskIdList = '';
    const taskStatus = '未着手';

    return await expect(
      usecase.execute({ taskIdList: taskIdList, taskStatus: taskStatus })
    ).resolves.toBe(undefined);
  });

  it('【正常系】特定の進捗ステータスを指定し、参加者一覧を取得できる', async () => {
    const usecase = new GetSearchTaskUseCase(mockSearchQS);

    const expectDatas: SearchDTO[] = [
      {
        id: faker.datatype.uuid(),
        name: 'taro',
        email: 'taro@example.com',
        taskId: taskId1,
        title: '課題1',
        status: '未着手',
      },
      {
        id: faker.datatype.uuid(),
        name: 'jiro',
        email: 'jiro@example.com',
        taskId: taskId2,
        title: '課題2',
        status: '未着手',
      },
    ];

    mockSearchQS.findByTaskIdAndTaskStatus.mockResolvedValueOnce(expectDatas);

    const taskIdList = `${taskId1},${taskId2}`;
    const taskStatus = '未着手';

    return await expect(
      usecase.execute({
        taskIdList: taskIdList,
        taskStatus: taskStatus,
      })
    ).resolves.toBe(expectDatas);
  });

  it('タスクステータスの値が不正な場合', async () => {
    const usecase = new GetSearchTaskUseCase(mockSearchQS);

    const taskIdList = `${taskId1},${taskId2}`;
    const taskStatus = '';

    return await expect(
      usecase.execute({ taskIdList: taskIdList, taskStatus: taskStatus })
    ).rejects.toThrowError();
  });
});
