import { PrismaClient } from '@prisma/client';
import { Identifier } from 'src/__shared__/identifier';
import { Member } from 'src/domain/member';
import { MemberEmailVO } from 'src/domain/member-email-vo';
import { MemberNameVO } from 'src/domain/member-name-vo';
import { MemberStatusVO } from 'src/domain/member-status-vo';
import { Task } from 'src/domain/task';
import { MemberRepository } from 'src/infra/db/repository/member-repository';
import { ProgressRepository } from 'src/infra/db/repository/progress-repository';
import { TaskRepository } from 'src/infra/db/repository/task-repository';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { CreateMemberUseCase } from '../create-member-usecase';

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
    const status = MemberStatusVO.create();

    const task = Task.reconstruct({
      id: new Identifier(taskId),
      title: taskTitle,
      content: taskContent,
    });

    const mockTask = mocked(task, true);

    const member1 = Member.create({
      id: memberId,
      name: new MemberNameVO('test'),
      email: new MemberEmailVO('test@example.co.jp'),
      status: status,
    });

    if (member1.isFailure()) {
      return;
    }

    const mockMember = mocked(member1.value, true);

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
    const { name, email } = member.getAllProperties();

    expect(member).toBeInstanceOf(Member);
    expect(name).toMatch(/test/);
    expect(email).toMatch(/test@example.co.jp/);
  });
});
