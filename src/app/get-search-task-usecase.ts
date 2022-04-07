import { validateProgressStatus } from 'src/domain/progress/progress-status';
import { PagingCondition } from 'src/domain/__shared__/Page';
import { ISearchQueryService } from './query-service-interface/search-task-query-service';

interface Props {
  taskIdList: string;
  taskStatus: string;
  pagingCondition: PagingCondition;
}
export class GetSearchTaskUseCase {
  private readonly queryService: ISearchQueryService;

  constructor(queryService: ISearchQueryService) {
    this.queryService = queryService;
  }

  public async execute(props: Props) {
    const { taskIdList, taskStatus, pagingCondition } = props;

    if (
      typeof taskIdList === 'undefined' ||
      typeof taskStatus === 'undefined'
    ) {
      throw new Error('input value is invalid.');
    }

    validateProgressStatus(taskStatus);

    if (typeof pagingCondition.pageNumber === 'undefined') {
      pagingCondition.pageNumber = 0;
    }

    if (typeof pagingCondition.pageSize === 'undefined') {
      pagingCondition.pageSize = 10;
    }

    try {
      return await this.queryService.findByTaskIdAndTaskStatus(
        taskIdList,
        taskStatus,
        pagingCondition
      );
    } catch (error) {
      throw error;
    }
  }
}
