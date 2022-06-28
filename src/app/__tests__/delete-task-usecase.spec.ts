import { PrismaClient } from '@prisma/client';
import * as faker from 'faker';
import { TaskService } from 'src/domain/domain-service/task-service';
import { Task } from 'src/domain/task';
import { TaskRepository } from 'src/infra/db/repository/task-repository';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { DeleteTaskUseCase } from '../delete-task-usecase';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/task-repository');
jest.mock('src/domain/domain-service/task-service');

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

    const usecase = new DeleteTaskUseCase(mockTaskService, mockTaskRepository);
    return await expect(usecase.execute({ taskId: taskId })).resolves.toBe(
      task1
    );
  });
});
