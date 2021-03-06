import { Page, PagingCondition } from 'src/__shared__/page';
import { DomainError, Result } from 'src/__shared__/result';

export class SearchDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;

  constructor(props: { id: string; name: string; email: string }) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
  }
}

export interface ISearchQueryService {
  findByTaskIdAndTaskStatus(
    taskIdList: string,
    taskStatus: string,
    pagingCondition: PagingCondition
  ): Promise<Result<Page<SearchDTO>, DomainError>>;
}
