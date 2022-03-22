import { Progress } from './progress';

export interface IProgressProps {
  taskId: string;
  memberId: string;
}

export interface IProgressRepository {
  getById(props: IProgressProps): Promise<Progress | null>;
  getAll(): Promise<Progress[] | null>;
  create(progress: Progress[]): Promise<void>;
  update(
    memberId: string,
    taskId: string,
    status: string
  ): Promise<Progress | null>;
}
