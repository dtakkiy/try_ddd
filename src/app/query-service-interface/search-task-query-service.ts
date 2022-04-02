export class SearchDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly taskId: string;
  public readonly title: string;
  public readonly status: string;

  constructor(props: {
    id: string;
    name: string;
    email: string;
    taskId: string;
    title: string;
    status: string;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.taskId = props.taskId;
    this.title = props.title;
    this.status = props.status;
  }
}

export interface ISearchQueryService {
  findByTaskIdAndTaskStatus(
    taskIdList: string,
    taskStatus: string,
    pageNumber?: string
  ): Promise<SearchDTO[]>;
}
