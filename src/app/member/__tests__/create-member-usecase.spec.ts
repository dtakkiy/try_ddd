import { PrismaClient } from '@prisma/client';
import { MemberRepository } from 'src/infra/db/repository/member-repository';
import { Identifier } from 'src/__share__/identifier';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { CreateMemberUseCase } from '../create-member-usecase';
import { mocked } from 'ts-jest/utils';
import { Member } from 'src/domain/member/member';
import { MemberStatus } from 'src/domain/member/member-status';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/member-repository');

describe('do', () => {
  let mockMemberRepository: MockedObjectDeep<MemberRepository>;
  beforeAll(() => {
    const prisma = new PrismaClient();
    mockMemberRepository = mocked(new MemberRepository(prisma), true);
  });

  it('[正常系] 参加者を新規追加する', () => {
    // 検証データを作成
    const taskId = Identifier.generator();
    const taskContent = '課題文';
    const taskTitle = '課題のタイトル';

    const memberId = Identifier.generator();
    const name = 'wada';
    const email = 'wada@example.co.jp';
    const status = MemberStatus.create();

    const expectMember = new Member({
      id: memberId,
      name: name,
      email: email,
      status: status,
    });

    // 課題を作成

    // モックを作成

    // ユースケース実行
    const usecase = new CreateMemberUseCase(mockMemberRepository);
    // expect(
    //   usecase.execute({ id: memberId, name: name, email: email })
    // ).resolves.toBe(expectMember);
  });
});
