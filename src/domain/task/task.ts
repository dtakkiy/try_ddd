import { Identifier } from 'src/__share__/identifier';

export interface ITask {
  id: string;
  title: string;
  content: string;
}

export class Task {
  private props: ITask;
  constructor(props: ITask) {
    const { id, title, content } = props;

    this.props = {
      id: id ?? Identifier.generator(),
      title: title,
      content: content,
    };
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
}
