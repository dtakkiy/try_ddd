import { PrismaClient } from '@prisma/client';
import { mocked } from 'ts-jest/utils';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';

jest.mock('@prisma/client');

describe('【ユースケース】特定の課題（複数可）が、特定の進捗ステータスになっている参加者一覧を取得する', () => {
  beforeAll(() => {
    const prisma = new PrismaClient();
  });

  it('【正常系】特定の課題（複数可）を指定し、参加者一覧を取得できる', () => {
    // 処理は空。後から記述する。
  });

  it('【正常系】特定の進捗ステータスを指定し、参加者一覧を取得できる', () => {
    // 処理は空。後から記述する。
  });

  it('【正常系】設計原則とDBモデリング1をレビュー完了している参加者一覧を取得する', () => {
    // 処理は空。後から記述する。
  });

  it('【正常系】DBモデリング3を未着手の参加者一覧を取得する', () => {
    // 処理は空。後から記述する。
  });

  it('【正常系】10人単位でページングできる', () => {
    // 処理は空。後から記述する。
  });
});
