import { PrismaClient } from '@prisma/client';

export class TaskService {
  private readonly prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  // 指定した課題と関連する課題進捗を削除
  public async deleteTask(taskId: string) {
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
      throw new Error('failed to delete task.');
    } finally {
      this.prismaClient.$disconnect();
    }
  }
}
