import { PrismaClient } from '@prisma/client';
import { Progress } from 'src/domain/progress/progress';
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

  public async getById(props: IProgressProps): Promise<Progress | null> {
    const memberOnTask = this.prismaClient.memberOnTask.findUnique({
      where: {
        memberId_taskId: {
          memberId: props.memberId,
          taskId: props.taskId,
        },
      },
    });

    if (memberOnTask === null) {
      throw new Error(`not found memberOnTask.`);
    }

    return new Progress({
      memberId: '',
      taskId: '',
      status: ProgressStatus.create({
        status: '',
      }),
    });
  }

  public async getAll(): Promise<Progress[] | null> {
    const memberOnTaskAll = await this.prismaClient.memberOnTask.findMany();

    return memberOnTaskAll.map(
      (memberOnTask) =>
        new Progress({
          memberId: memberOnTask.memberId,
          taskId: memberOnTask.taskId,
          status: ProgressStatus.create({ status: memberOnTask.status }),
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
}
