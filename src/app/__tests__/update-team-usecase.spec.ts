import { PrismaClient } from '@prisma/client';
import { mocked } from 'ts-jest/utils';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';

jest.mock('@prisma/client');

describe('【ユースケース】チームの更新', () => {
  beforeAll(() => {
    const prisma = new PrismaClient();
  });

  it('【正常系】チームに所属するペアを変更できる', () => {
    // 処理は空。後から記述する。
  });
});
