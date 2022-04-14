import { PrismaClient } from '@prisma/client';
import { TaskService } from '../domain-service/task-service';
import * as faker from 'faker';

jest.mock('@prisma/client');

describe('task-serviceのテスト', () => {
  let taskService: TaskService;

  beforeAll(() => {
    const prisma = new PrismaClient();
    taskService = new TaskService(prisma);
  });

  it('インスタンスの生成', () => {
    expect(taskService).toBeInstanceOf(TaskService);
  });

  it('実行に失敗', async () => {
    const taskId = faker.datatype.uuid();
    await expect(taskService.deleteTask(taskId)).rejects.toThrowError();
  });
});
