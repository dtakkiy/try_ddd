import { PrismaClient } from '@prisma/client';
import {
  DSError,
  Failure,
  NonError,
  Result,
  Success,
} from 'src/__shared__/result';

export class TaskService {
  constructor(private readonly prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  // 指定した課題と関連する課題進捗を削除
  public async deleteTask(taskId: string): Promise<Result<NonError, DSError>> {
    const deleteTask = this.prismaClient.task.delete({
      where: {
        id: taskId,
      },
    });

    // task集約の範囲外
    const deleteMemberOnTasks = this.prismaClient.memberOnTask.deleteMany({
      where: {
        taskId: taskId,
      },
    });

    try {
      await this.prismaClient.$transaction([deleteMemberOnTasks, deleteTask]);
    } catch (e) {
      return new Failure('failed to delete task.');
    } finally {
      this.prismaClient.$disconnect();
    }

    return new Success(null);
  }
}
