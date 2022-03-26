import { validateProgressStatus } from 'src/domain/progress/progress-status';
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
    const { taskIdList, taskStatus, pageNumber } = props;

    if (
      typeof taskIdList === 'undefined' ||
      typeof taskStatus === 'undefined'
    ) {
      throw new Error('input value is invalid.');
    }

    validateProgressStatus(taskStatus);

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
