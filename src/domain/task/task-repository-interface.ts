import { Task } from './task';

export interface ITaskRepository {
  getById(id: string): Promise<Task | null>;
  getAll(): Promise<Task[] | null>;
}
