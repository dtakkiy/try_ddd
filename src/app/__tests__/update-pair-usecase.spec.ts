import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client');

describe('【ユースケース】ペアの更新', () => {
  beforeAll(() => {
    const prisma = new PrismaClient();
  });

  it('【正常系】ペアに所属する参加者を変更できる', () => {
    // 処理は空。後から記述する。
  });
});
