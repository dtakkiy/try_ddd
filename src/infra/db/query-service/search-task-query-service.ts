import { PrismaClient } from '@prisma/client';
import {
  SearchDTO,
  ISearchQueryService,
} from 'src/app/query-service-interface/search-task-query-service';
import { Page, Paging, PagingCondition } from 'src/domain/__shared__/Page';

export class SearchQueryService implements ISearchQueryService {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async findByTaskIdAndTaskStatus(
    taskIdList: string,
    taskStatus: string,
    pagingCondition: PagingCondition
  ): Promise<Page<SearchDTO>> {
    const pageSize = pagingCondition.pageSize;
    const pageNumber = pagingCondition.pageNumber;

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

    // 参加者一覧を取得
    const members = await this.prismaClient.member.findMany({
      include: {
        MemberOnTask: {
          include: {
            task: true,
          },
        },
      },
      where: {
        MemberOnTask: {
          some: {
            status: {
              equals: taskStatus,
            },
            taskId: {
              in: taskIds,
            },
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    // 課題進捗の一覧を取得
    const tasks = await this.prismaClient.memberOnTask.findMany({
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
    });

    // 参加者と課題進捗を突き合わせ
    const targetMember = members.filter((member) => {
      const memberTasks = tasks.filter((task) => {
        return task.memberId === member.id;
      });

      const x = memberTasks.map((memberTask) => {
        return memberTask.status === taskStatus;
      });

      return x.length === taskIds.length;
    });

    const items = targetMember.map(
      (DM) =>
        new SearchDTO({
          id: DM.id,
          name: DM.name,
          email: DM.email,
        })
    );

    // ページング処理
    const targetItems: SearchDTO[] = items.slice(
      pageNumber * pageSize,
      pageNumber * pageSize + pageSize
    );

    const paging: Paging = {
      totalCount: items.length,
      pageSize: pageSize,
      pageNumber: pageNumber,
    };

    const page: Page<SearchDTO> = {
      items: targetItems,
      paging: paging,
    };

    return page;
  }
}
