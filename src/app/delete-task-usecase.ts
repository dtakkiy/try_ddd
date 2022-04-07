import { PrismaClient } from '@prisma/client';
import { Task } from 'src/domain/task/task';
import { TaskService } from 'src/domain/task/task-service';
import { TaskRepository } from 'src/infra/db/repository/task-repository';

interface Props {
  taskId: string;
}

export class DeleteTaskUseCase {
  private readonly prismaClient: PrismaClient;
  private readonly taskRepository: TaskRepository;

  constructor(prismaClient: PrismaClient, taskRepository: TaskRepository) {
    this.prismaClient = prismaClient;
    this.taskRepository = taskRepository;
  }

  public async execute(props: Props): Promise<Task> {
    const task = await this.taskRepository.getById(props.taskId);

    if (task === null) {
      throw new Error('task could not be found.');
    }

    const taskService = new TaskService(this.prismaClient);
    await taskService.deleteTask(props.taskId);

    return task;
  }
}