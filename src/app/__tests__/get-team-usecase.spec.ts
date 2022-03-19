import { PrismaClient } from '@prisma/client';
import { mocked } from 'ts-jest/utils';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { GetTeamUseCase } from '../get-team-usecase';
import { TeamQueryService } from 'src/infra/db/query-service/team-query-service';

jest.mock('@prisma/client');
jest.mock('src/infra/db/query-service/team-query-service');

describe('【ユースケース】チームの一覧を取得する', () => {
  let mockTeamQueryService: MockedObjectDeep<TeamQueryService>;
  beforeAll(() => {
    const prisma = new PrismaClient();
    mockTeamQueryService = mocked(new TeamQueryService(prisma), true);
  });

  it('【正常系】チームの一覧を取得する', async () => {
    const usecase = new GetTeamUseCase(mockTeamQueryService);
    return await expect(usecase.execute()).resolves.toBe(undefined);
  });
});
