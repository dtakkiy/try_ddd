import { PrismaClient } from '@prisma/client';
import { mocked } from 'ts-jest/utils';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { GetSearchTaskUseCase } from '../get-search-task-usecase';
import { SearchQueryService } from 'src/infra/db/query-service/search-task-query-service';
import * as faker from 'faker';
import { SearchDTO } from '../query-service-interface/search-task-query-service';
import { Page, Paging, PagingCondition } from 'src/domain/__shared__/page';

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

    const pagingCondition: PagingCondition = {
      pageNumber: 0,
      pageSize: 10,
    };

    return await expect(
      usecase.execute({
        taskIdList: taskIdList,
        taskStatus: taskStatus,
        pagingCondition: pagingCondition,
      })
    ).resolves.toBe(undefined);
  });

  it('【正常系】特定の進捗ステータスを指定し、参加者一覧を取得できる', async () => {
    const usecase = new GetSearchTaskUseCase(mockSearchQS);

    const expectDatas: SearchDTO[] = [
      {
        id: faker.datatype.uuid(),
        name: 'taro',
        email: 'taro@example.com',
      },
      {
        id: faker.datatype.uuid(),
        name: 'jiro',
        email: 'jiro@example.com',
      },
    ];

    const paging: Paging = {
      totalCount: 2,
      pageSize: 10,
      pageNumber: 1,
    };

    const expectPage: Page<SearchDTO> = {
      items: expectDatas,
      paging: paging,
    };

    mockSearchQS.findByTaskIdAndTaskStatus.mockResolvedValueOnce(expectDatas);

    const taskIdList = `${taskId1},${taskId2}`;
    const taskStatus = '未着手';

    const pagingCondition: PagingCondition = {
      pageNumber: 0,
      pageSize: 10,
    };

    return await expect(
      usecase.execute({
        taskIdList: taskIdList,
        taskStatus: taskStatus,
        pagingCondition: pagingCondition,
      })
    ).resolves.toBe(expectDatas);
  });

  it('タスクステータスの値が不正な場合', async () => {
    const usecase = new GetSearchTaskUseCase(mockSearchQS);

    const taskIdList = `${taskId1},${taskId2}`;
    const taskStatus = '';

    const pagingCondition: PagingCondition = {
      pageNumber: 0,
      pageSize: 10,
    };

    return await expect(
      usecase.execute({
        taskIdList: taskIdList,
        taskStatus: taskStatus,
        pagingCondition: pagingCondition,
      })
    ).rejects.toThrowError();
  });
});
