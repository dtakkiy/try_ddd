import { Identifier } from 'src/__shared__/identifier';
import { Task } from '../task';

interface IProps {
  id: string;
  title: string;
  content: string;
}

export class TaskFactory {
  public static execute = (props: IProps): Task | null => {
    const id = props.id ?? Identifier.generator();
    const { title, content } = props;

    return Task.create({ id, title, content });
  };
}
