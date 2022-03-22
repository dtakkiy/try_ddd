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
    taskIdList: string[],
    taskStatus: string,
    pageNumber?: string
  ): Promise<SearchDTO[]> {
    const PAGE_SIZE = 10;

    let results: any[];

    // pagingを実装する

    if (typeof pageNumber === 'string') {
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
              in: taskIdList,
            },
          },
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
              in: taskIdList,
            },
          },
        },
      });
    }

    return results.map(
      (searchDM) =>
        new SearchDTO({
          id: searchDM.id,
          name: searchDM.name,
          email: searchDM.email,
          status: searchDM.status,
        })
    );
  }
}
