import { PrismaClient } from '@prisma/client';
import { Identifier } from 'src/__shared__/identifier';
import { ITaskRepository } from 'src/domain/repository-interface/task-repository-interface';
import { Task } from 'src/domain/task';

export class TaskRepository implements ITaskRepository {
  constructor(private readonly prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getById(id: string): Promise<Task | null> {
    const task = await this.prismaClient.task.findUnique({
      where: { id: id },
    });

    if (task === null) {
      return null;
    }

    return Task.reconstruct({
      id: new Identifier(task.id),
      title: task.title,
      content: task.content,
    });
  }

  public async getAll(): Promise<Task[] | null> {
    const taskAll = await this.prismaClient.task.findMany();

    if (taskAll === null) {
      return null;
    }

    return taskAll.map((task) => {
      return Task.reconstruct({
        id: new Identifier(task.id),
        title: task.title,
        content: task.content,
      });
    });
  }
}
