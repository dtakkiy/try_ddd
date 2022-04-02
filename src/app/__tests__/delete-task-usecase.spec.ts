import { PrismaClient } from '@prisma/client';
import { TaskRepository } from 'src/infra/db/repository/task-repository';
import { DeleteTaskUseCase } from '../delete-task-usecase';
import * as faker from 'faker';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { Task } from 'src/domain/task/task';
import { TaskService } from 'src/domain/task/task-service';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/task-repository');
jest.mock('src/domain/task/task-service');

describe('課題の削除', () => {
  let prisma: PrismaClient;
  let mockTaskRepository: MockedObjectDeep<TaskRepository>;
  let mockTaskService: MockedObjectDeep<TaskService>;

  beforeAll(() => {
    prisma = new PrismaClient();
    mockTaskRepository = mocked(new TaskRepository(prisma), true);
    mockTaskService = mocked(new TaskService(prisma), true);
  });

  it('正常系', async () => {
    const taskId = faker.datatype.uuid();
    const task1 = new Task({
      id: taskId,
      title: '課題1',
      content: '本文',
    });

    mockTaskRepository.getById.mockResolvedValueOnce(task1);
    mockTaskService.deleteTask.mockResolvedValueOnce();

    const usecase = new DeleteTaskUseCase(prisma, mockTaskRepository);
    return await expect(usecase.execute({ taskId: taskId })).resolves.toBe(
      task1
    );
  });
});
