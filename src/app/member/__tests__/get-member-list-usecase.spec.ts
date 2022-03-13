import { PrismaClient } from '@prisma/client';
import { MemberQueryService } from 'src/infra/db/query-service/member-query-service';
import { GetMemberListUseCase } from '../get-member-list-usecase';

import { mocked } from 'ts-jest/utils';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';

jest.mock('@prisma/client');
jest.mock('src/infra/db/query-service/member-query-service');

describe('do', () => {
  let mockMemberQueryService: MockedObjectDeep<MemberQueryService>;
  beforeAll(() => {
    const prisma = new PrismaClient();
    mockMemberQueryService = mocked(new MemberQueryService(prisma), true);
  });

  it('[正常系] 参加者の一覧を取得する', async () => {
    const usecase = new GetMemberListUseCase(mockMemberQueryService);
    return expect(usecase.execute()).resolves.toBe(undefined);
  });
});
