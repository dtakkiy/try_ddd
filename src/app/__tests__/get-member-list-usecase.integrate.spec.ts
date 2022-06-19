import { PrismaClient } from '@prisma/client';
import { MemberQueryService } from 'src/infra/db/query-service/member-query-service';
import { GetMemberListUseCase } from '../get-member-list-usecase';

describe('【ユースケース】結合テスト 参加者一覧を取得する', () => {
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('[正常系] 結合テスト 参加者の一覧を取得する', async () => {
    const memberQueryService = new MemberQueryService(prisma);
    const usecase = new GetMemberListUseCase(memberQueryService);
    return await expect(usecase.execute()).resolves.toBe(undefined);
  });

  it('結合テスト 参加者一覧の件数を検証', async () => {
    const memberQueryService = new MemberQueryService(prisma);
    const usecase = new GetMemberListUseCase(memberQueryService);
    const memberDTO = await usecase.execute();
    expect(memberDTO.length).toBe(4);
  });
});
