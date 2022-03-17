import { PrismaClient } from '@prisma/client';
import { mocked } from 'ts-jest/utils';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';

jest.mock('@prisma/client');

describe('【ユースケース】ペアの一覧を取得する', () => {
  beforeAll(() => {
    const prisma = new PrismaClient();
  });

  it('【正常系】ペアの一覧を取得する', () => {
    // 処理は空。後から記述する。
  });
});
