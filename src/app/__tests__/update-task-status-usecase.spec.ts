import { PrismaClient } from '@prisma/client';
import { mocked } from 'ts-jest/utils';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';

jest.mock('@prisma/client');

describe('【ユースケース】課題進捗の更新', () => {
  beforeAll(() => {
    const prisma = new PrismaClient();
  });

  it('【正常系】特定の参加者の課題進捗ステータスを変更できる', () => {
    // 処理は空。後から記述する。
  });
});
