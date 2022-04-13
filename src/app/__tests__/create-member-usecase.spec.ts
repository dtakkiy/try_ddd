import { PrismaClient } from '@prisma/client';
import { MemberRepository } from 'src/infra/db/repository/member-repository';
import { Identifier } from 'src/__shared__/identifier';
import { CreateMemberUseCase } from '../create-member-usecase';
import { Member } from 'src/domain/member';
import { MemberStatus } from 'src/domain/member-status-vo';
import { ProgressRepository } from 'src/infra/db/repository/progress-repository';
import { Task } from 'src/domain/task';
import { mocked } from 'ts-jest/utils';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { TaskRepository } from 'src/infra/db/repository/task-repository';
import { MemberEmailVO } from 'src/domain/member-email-vo';
import { MemberNameVO } from 'src/domain/member-name-vo';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/member-repository');
jest.mock('src/infra/db/repository/progress-repository');
jest.mock('src/infra/db/repository/task-repository');

describe('【ユースケース】参加者を新規追加する', () => {
  let mockMemberRepository: MockedObjectDeep<MemberRepository>;
  let mockProgressRepository: MockedObjectDeep<ProgressRepository>;
  let mockTaskRepository: MockedObjectDeep<TaskRepository>;

  beforeAll(() => {
    const prisma = new PrismaClient();
    mockMemberRepository = mocked(new MemberRepository(prisma), true);
    mockProgressRepository = mocked(new ProgressRepository(prisma), true);
    mockTaskRepository = mocked(new TaskRepository(prisma), true);
  });

  it('[正常系] 参加者を新規追加する', async () => {
    // 検証データを作成
    const taskId = Identifier.generator();
    const taskContent = '課題文';
    const taskTitle = '課題のタイトル';

    const memberId = Identifier.generator();
    const name = new MemberNameVO('test');
    const email = new MemberEmailVO('test@example.co.jp');
    const status = MemberStatus.create();

    const mockTask = mocked(
      new Task({
        id: taskId,
        title: taskTitle,
        content: taskContent,
      }),
      true
    );

    const mockMember = mocked(
      new Member({
        id: memberId,
        name: name,
        email: email,
        status: status,
      }),
      true
    );

    mockMemberRepository.getAll.mockResolvedValueOnce([]);
    mockTaskRepository.getAll.mockResolvedValueOnce([mockTask]);
    mockMemberRepository.create.mockResolvedValueOnce(mockMember);

    const usecase = new CreateMemberUseCase(
      mockMemberRepository,
      mockProgressRepository,
      mockTaskRepository
    );

    const member = await usecase.execute({
      name: 'test',
      email: 'test@example.co.jp',
    });
    expect(member).toBeInstanceOf(Member);
    expect(member.name.getValue()).toMatch(/test/);
    expect(member.email.getEmail()).toMatch(/test@example.co.jp/);
  });
});
