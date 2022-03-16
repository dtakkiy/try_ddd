import { PrismaClient } from '@prisma/client';
import { Task } from 'src/domain/task/task';
import { TaskFactory } from 'src/domain/task/task-factory';
import { ITaskRepository } from 'src/domain/task/task-repository-interface';

export class TaskRepository implements ITaskRepository {
  private readonly prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public getById = async (id: string): Promise<Task | null> => {
    const task = await this.prismaClient.task.findUnique({
      where: { id: id },
    });

    if (task === null) {
      throw new Error(`not found task data.`);
    }

    return TaskFactory.execute({
      id: task.id,
      title: task.title,
      content: task.content,
    });
  };

  public getAll = async (): Promise<Task[] | null> => {
    const taskAll = await this.prismaClient.task.findMany();

    if (taskAll === null) {
      throw new Error(`not found task data.`);
    }

    return taskAll.map((task) => {
      return TaskFactory.execute({
        id: task.id,
        title: task.title,
        content: task.content,
      });
    });
  };
}
