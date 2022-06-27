import { PrismaClient } from '@prisma/client';
import { PairQueryService } from 'src/infra/db/query-service/pair-query-service';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { GetPairUseCase } from '../get-pair-usecase';

jest.mock('@prisma/client');
jest.mock('src/infra/db/query-service/pair-query-service');

describe('【ユースケース】ペアの一覧を取得する', () => {
  let mockPairQueryService: MockedObjectDeep<PairQueryService>;

  beforeAll(() => {
    const prisma = new PrismaClient();
    mockPairQueryService = mocked(new PairQueryService(prisma), true);
  });

  it('【正常系】ペアの一覧を取得する', async () => {
    const usecase = new GetPairUseCase(mockPairQueryService);
    return await expect(usecase.execute()).resolves.toBe(undefined);
  });
});
