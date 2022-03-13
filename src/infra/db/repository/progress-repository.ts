import { PrismaClient } from '@prisma/client';
import { Progress } from 'src/domain/progress/progress';
import { ProgressFactory } from 'src/domain/progress/progress-factory';
import {
  IProgressRepository,
  IProgressProps,
} from 'src/domain/progress/progress-repository-interface';
import { ProgressStatus } from 'src/domain/progress/progress-status';

export class ProgressRepository implements IProgressRepository {
  private readonly prismaClient;
  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public getById = async (props: IProgressProps): Promise<Progress | null> => {
    const memberOnTask = this.prismaClient.memberOnTask.findUnique({
      where: {
        memberId_taskId: {
          memberId: props.memberId,
          taskId: props.taskId,
        },
      },
    });

    if (memberOnTask === null) {
      throw new Error();
    }

    return Progress.create({
      memberId: '',
      taskId: '',
      status: ProgressStatus.create({
        status: '',
      }),
    });
  };

  public getAll = async (): Promise<Progress[] | null> => {
    const memberOnTaskAll = await this.prismaClient.memberOnTask.findMany();

    return memberOnTaskAll.map((memberOnTask) =>
      Progress.create({
        memberId: memberOnTask.memberId,
        taskId: memberOnTask.taskId,
        status: ProgressStatus.create({ status: memberOnTask.status }),
      })
    );
  };

  public save = async (progress: Progress): Promise<void> => {
    await this.prismaClient.memberOnTask.update({
      where: {
        memberId_taskId: {
          memberId: progress.memberId,
          taskId: progress.taskId,
        },
      },
      data: {
        status: progress.status,
      },
    });
  };
}
