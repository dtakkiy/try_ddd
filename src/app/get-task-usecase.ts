import { ITaskQueryService } from './query-service-interface/task-query-service';

export class GetTaskUseCase {
  constructor(private readonly taskQueryService: ITaskQueryService) {
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
