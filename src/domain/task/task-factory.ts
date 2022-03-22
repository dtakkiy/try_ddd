import { Identifier } from 'src/__share__/identifier';
import { Task } from './task';

interface IProps {
  id: string;
  title: string;
  content: string;
}

export class TaskFactory {
  public static execute = (props: IProps): Task => {
    const id = props.id ?? Identifier.generator();
    const { title, content } = props;

    return new Task({ id, title, content });
  };
}
