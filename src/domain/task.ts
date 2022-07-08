import { Identifier } from 'src/__shared__/identifier';

export interface ITask {
  id: Identifier;
  title: string;
  content: string;
}

export class Task {
  private constructor(private readonly props: ITask) {
    const { id, title, content } = props;

    this.props = {
      id: id,
      title: title,
      content: content,
    };
  }

  public getAllProperties() {
    return {
      id: this.props.id.getId(),
      title: this.props.title,
      content: this.props.content,
    };
  }

  public getId() {
    return this.props.id.getId();
  }

  public isSameTask = (task: Task): boolean => {
    return task.props.id.getId() === this.props.id.getId();
  };

  public static create = (props: ITask): Task | null => {
    try {
      return new Task(props);
    } catch (e) {
      return null;
    }
  };

  public static reconstruct = (props: ITask): Task => {
    return new Task(props);
  };
}
