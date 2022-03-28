import { ITaskQueryService } from './query-service-interface/task-query-service';

export class GetTaskUseCase {
  queryService: ITaskQueryService;
  constructor(queryService: ITaskQueryService) {
    this.queryService = queryService;
  }

  public async execute() {
    try {
      return await this.queryService.getAll();
    } catch (e) {
      throw e;
    }
  }
}
