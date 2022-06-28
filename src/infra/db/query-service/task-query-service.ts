import { PrismaClient } from '@prisma/client';
import {
  ITaskQueryService,
  TaskDTO,
} from 'src/app/query-service-interface/task-query-service';

export class TaskQueryService implements ITaskQueryService {
  constructor(private readonly prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getAll(): Promise<TaskDTO[]> {
    const tasks = await this.prismaClient.task.findMany({});

    return tasks.map((task) => {
      return new TaskDTO({
        id: task.id,
        title: task.title,
        content: task.content,
      });
    });
  }
}
