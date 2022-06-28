import { TaskService } from 'src/domain/domain-service/task-service';
import { Task } from 'src/domain/task';
import { TaskRepository } from 'src/infra/db/repository/task-repository';

interface Props {
  taskId: string;
}

export class DeleteTaskUseCase {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskRepository: TaskRepository
  ) {
    this.taskService = taskService;
    this.taskRepository = taskRepository;
  }

  public async execute(props: Props): Promise<Task> {
    const task = await this.taskRepository.getById(props.taskId);

    if (task === null) {
      throw new Error('task could not be found.');
    }

    await this.taskService.deleteTask(props.taskId);

    return task;
  }
}
