import { Page, PagingCondition } from 'src/__shared__/page';
import { DomainError, Failure, Result } from 'src/__shared__/result';
import {
  validateProgressStatus,
  validateSearchProgressStatus,
} from 'src/domain/progress-status-vo';
import {
  ISearchQueryService,
  SearchDTO,
} from './query-service-interface/search-task-query-service';

interface Props {
  taskIdList: string;
  taskStatus: string;
  pagingCondition: PagingCondition;
}
export class GetSearchTaskUseCase {
  constructor(private readonly searchQueryService: ISearchQueryService) {
    this.searchQueryService = searchQueryService;
  }

  public async execute(
    props: Props
  ): Promise<Result<Page<SearchDTO>, DomainError>> {
    const { taskIdList, taskStatus, pagingCondition } = props;

    // if (
    //   typeof taskIdList === 'undefined' ||
    //   typeof taskStatus === 'undefined'
    // ) {
    //   throw new Error('input value is invalid.');
    // }

    const error = validateSearchProgressStatus(taskStatus);
    if (error) {
      return new Failure(error);
    }

    if (typeof pagingCondition.pageNumber === 'undefined') {
      pagingCondition.pageNumber = 0;
    }

    if (typeof pagingCondition.pageSize === 'undefined') {
      pagingCondition.pageSize = 10;
    }

    return await this.searchQueryService.findByTaskIdAndTaskStatus(
      taskIdList,
      taskStatus,
      pagingCondition
    );
  }
}
