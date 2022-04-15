import { ITaskQueryService } from './query-service-interface/task-query-service';

export class GetTaskUseCase {
  taskQueryService: ITaskQueryService;
  constructor(taskQueryService: ITaskQueryService) {
    this.taskQueryService = taskQueryService;
  }

  public async execute() {
    try {
      return await this.taskQueryService.getAll();
    } catch (e) {
      throw e;
    }
  }
}
