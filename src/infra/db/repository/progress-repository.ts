import { PrismaClient } from '@prisma/client';
import { Progress } from 'src/domain/progress';
import { ProgressStatusVO } from 'src/domain/progress-status-vo';
import {
  IProgressRepository,
  IProgressProps,
} from 'src/domain/repository-interface/progress-repository-interface';

export class ProgressRepository implements IProgressRepository {
  constructor(private readonly prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getById(props: IProgressProps): Promise<Progress | null> {
    const memberOnTask = await this.prismaClient.memberOnTask.findFirst({
      where: {
        memberId: props.memberId,
        taskId: props.taskId,
      },
    });

    if (memberOnTask === null) {
      throw new Error(`not found memberOnTask.`);
    }

    return new Progress({
      memberId: memberOnTask.memberId,
      taskId: memberOnTask.taskId,
      status: new ProgressStatusVO(memberOnTask.status),
    });
  }

  public async getAll(): Promise<Progress[] | null> {
    const memberOnTaskAll = await this.prismaClient.memberOnTask.findMany();

    return memberOnTaskAll.map(
      (memberOnTask) =>
        new Progress({
          memberId: memberOnTask.memberId,
          taskId: memberOnTask.taskId,
          status: new ProgressStatusVO(memberOnTask.status),
        })
    );
  }

  public async create(progressList: Progress[]): Promise<void> {
    const data = progressList.map((progress) => {
      const status = progress.status;
      const memberId = progress.memberId;
      const taskId = progress.taskId;

      return { status, memberId, taskId };
    });

    await this.prismaClient.memberOnTask.createMany({
      data: data,
    });
  }

  public async update(memberId: string, taskId: string, status: string) {
    const progress = await this.prismaClient.memberOnTask.findFirst({
      where: {
        memberId: memberId,
        taskId: taskId,
      },
    });

    const updateProgress = await this.prismaClient.memberOnTask.update({
      where: {
        id: progress?.id,
      },
      data: {
        status: status,
      },
    });

    return new Progress({
      memberId: updateProgress.memberId,
      taskId: updateProgress.taskId,
      status: new ProgressStatusVO(updateProgress.status),
    });
  }
}
