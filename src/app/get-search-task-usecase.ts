import { ISearchQueryService } from './query-service-interface/search-task-query-service';

interface Props {
  taskIdList: string;
  taskStatus: string;
  pageNumber?: string;
}
export class GetSearchTaskUseCase {
  private readonly queryService: ISearchQueryService;

  constructor(queryService: ISearchQueryService) {
    this.queryService = queryService;
  }

  public async execute(props: Props) {
    try {
      return await this.queryService.findByTaskIdAndTaskStatus(
        props.taskIdList,
        props.taskStatus,
        props.pageNumber
      );
    } catch (error) {
      throw error;
    }
  }
}
