import { Page } from 'src/domain/__shared__/Page';

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
    pageNumber?: string
  ): Promise<Page<SearchDTO>>;
}
