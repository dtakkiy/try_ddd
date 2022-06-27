import { PrismaClient } from '@prisma/client';
import { MemberQueryService } from 'src/infra/db/query-service/member-query-service';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { GetMemberListUseCase } from '../get-member-list-usecase';

jest.mock('@prisma/client');
jest.mock('src/infra/db/query-service/member-query-service');

describe('【ユースケース】参加者一覧を取得する', () => {
  let mockMemberQueryService: MockedObjectDeep<MemberQueryService>;
  beforeAll(() => {
    const prisma = new PrismaClient();
    mockMemberQueryService = mocked(new MemberQueryService(prisma), true);
  });

  it('[正常系] 参加者の一覧を取得する', async () => {
    const usecase = new GetMemberListUseCase(mockMemberQueryService);
    return await expect(usecase.execute()).resolves.toBe(undefined);
  });
});
