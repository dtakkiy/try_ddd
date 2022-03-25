export class SearchDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly status: string;

  constructor(props: {
    id: string;
    name: string;
    email: string;
    status: string;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.status = props.status;
  }
}

export interface ISearchQueryService {
  findByTaskIdAndTaskStatus(
    taskIdList: string[],
    taskStatus: string,
    pageNumber?: string
  ): Promise<SearchDTO[]>;

  // fetchByTaskIdAndTaskStatus(
  //   taskId: string[],
  //   taskStatus: string,
  //   pagingCondition: PagingCondition
  // ): Promise<Page<SearchDTO>>;
}
