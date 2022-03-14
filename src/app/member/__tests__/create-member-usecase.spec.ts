import { PrismaClient } from '@prisma/client';
import { MemberRepository } from 'src/infra/db/repository/member-repository';
import { Identifier } from 'src/__share__/identifier';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { CreateMemberUseCase } from '../create-member-usecase';
import { mocked } from 'ts-jest/utils';
import { Member } from 'src/domain/member/member';
import { MemberStatus } from 'src/domain/member/member-status';
import { TaskRepository } from 'src/infra/db/repository/task-repository';
import { ProgressRepository } from 'src/infra/db/repository/progress-repository';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/member-repository');
jest.mock('src/infra/db/repository/task-repository');
jest.mock('src/infra/db/repository/progress-repository');

describe('do', () => {
  let mockMemberRepository: MockedObjectDeep<MemberRepository>;
  let mockTaskRepository: MockedObjectDeep<TaskRepository>;
  let mockProgressRepository: MockedObjectDeep<ProgressRepository>;

  beforeAll(() => {
    const prisma = new PrismaClient();
    mockMemberRepository = mocked(new MemberRepository(prisma), true);
    mockTaskRepository = mocked(new TaskRepository(prisma), true);
    mockProgressRepository = mocked(new ProgressRepository(prisma), true);
  });

  it('[正常系] 参加者を新規追加する', async () => {
    // 検証データを作成
    const taskId = Identifier.generator();
    const taskContent = '課題文';
    const taskTitle = '課題のタイトル';

    const memberId = Identifier.generator();
    const name = 'test';
    const email = 'test@example.co.jp';
    const status = MemberStatus.create();

    const expectMember = new Member({
      id: memberId,
      name: name,
      email: email,
      status: status,
    });

    const usecase = new CreateMemberUseCase(
      mockMemberRepository,
      mockProgressRepository,
      mockTaskRepository
    );

    // return expect(
    //   usecase.execute({ name: 'test', email: 'test@example.co.jp' })
    // ).resolves.toBe(expectMember);
  });
});
