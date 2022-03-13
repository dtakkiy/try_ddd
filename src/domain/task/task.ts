export interface ITask {
  id: string;
  title: string;
  content: string;
}

export class Task {
  private props: ITask;
  constructor(props: ITask) {
    this.props = props;
  }

  public get id() {
    return this.props.id;
  }

  public get title() {
    return this.props.title;
  }

  public get content() {
    return this.props.content;
  }

  public equals = (task: Task): boolean => {
    return task.props.id === this.props.id;
  };

  public static create(props: ITask) {
    return new Task(props);
  }
}
