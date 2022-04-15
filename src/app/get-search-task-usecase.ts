import { validateProgressStatus } from 'src/domain/progress-status-vo';
import { PagingCondition } from 'src/domain/__shared__/page';
import { ISearchQueryService } from './query-service-interface/search-task-query-service';

interface Props {
  taskIdList: string;
  taskStatus: string;
  pagingCondition: PagingCondition;
}
export class GetSearchTaskUseCase {
  private readonly searchQueryService: ISearchQueryService;

  constructor(searchQueryService: ISearchQueryService) {
    this.searchQueryService = searchQueryService;
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
      return await this.searchQueryService.findByTaskIdAndTaskStatus(
        taskIdList,
        taskStatus,
        pagingCondition
      );
    } catch (error) {
      throw error;
    }
  }
}
