import { ISearchQueryService } from './query-service-interface/search-task-query-service';

export class GetSearchTaskUseCase {
  private readonly queryService: ISearchQueryService;

  constructor(queryService: ISearchQueryService) {
    this.queryService = queryService;
  }

  public async execute(
    taskIdList: string[],
    taskStatus: string,
    pageNumber?: string
  ) {
    try {
      return await this.queryService.findByTaskIdAndTaskStatus(
        taskIdList,
        taskStatus,
        pageNumber
      );
    } catch (error) {
      throw error;
    }
  }
}
