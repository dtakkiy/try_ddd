import { Progress } from './progress';

export interface IProgressProps {
  taskId: string;
  memberId: string;
}

export interface IProgressRepository {
  getById(props: IProgressProps): Promise<Progress | null>;
  getAll(): Promise<Progress[] | null>;
  save(progress: Progress): Promise<void>;
}
