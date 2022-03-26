import { PrismaClient } from '@prisma/client';
import {
  SearchDTO,
  ISearchQueryService,
} from 'src/app/query-service-interface/search-task-query-service';

export class SearchQueryService implements ISearchQueryService {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async findByTaskIdAndTaskStatus(
    taskIdList: string,
    taskStatus: string,
    pageNumber?: string
  ): Promise<SearchDTO[]> {
    const PAGE_SIZE = 10;
    let results: any[];

    if (typeof taskStatus !== 'string') {
      taskStatus = '未着手'; // タスクステータスが未入力だった場合、値を「未完了」とする
    }

    if (typeof taskIdList === 'undefined') {
      throw new Error('input taskIdList invalid.');
    }

    let taskIds: string[] = [];

    if (!taskIdList.includes(',')) {
      taskIds.push(taskIdList);
    } else {
      taskIds = taskIdList.split(',');
    }

    if (typeof pageNumber === 'string') {
      results = await this.prismaClient.memberOnTask.findMany({
        take: PAGE_SIZE,
        skip: 1,
        cursor: {
          id: pageNumber,
        },
        include: {
          task: true,
          member: true,
        },
        where: {
          AND: {
            status: {
              equals: taskStatus,
            },
            taskId: {
              in: taskIds,
            },
          },
        },
        orderBy: {
          id: 'asc',
        },
      });
    } else {
      results = await this.prismaClient.memberOnTask.findMany({
        take: PAGE_SIZE,
        include: {
          task: true,
          member: true,
        },
        where: {
          AND: {
            status: {
              equals: taskStatus,
            },
            taskId: {
              in: taskIds,
            },
          },
        },
        orderBy: {
          id: 'asc',
        },
      });
    }

    return results.map(
      (searchDM) =>
        new SearchDTO({
          id: searchDM.id,
          name: searchDM.member.name,
          email: searchDM.member.email,
          taskId: searchDM.task.id,
          title: searchDM.task.title,
          status: searchDM.status,
        })
    );
  }
}
