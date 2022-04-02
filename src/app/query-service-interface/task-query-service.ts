export class TaskDTO {
  public readonly id: string;
  public readonly title: string;
  public readonly content: string;

  constructor(props: { id: string; title: string; content: string }) {
    this.id = props.id;
    this.title = props.title;
    this.content = props.content;
  }
}

export interface ITaskQueryService {
  getAll(): Promise<TaskDTO[]>;
}
