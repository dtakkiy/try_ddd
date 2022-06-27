import { Prisma, PrismaClient } from '@prisma/client';
import { Page, Paging, PagingCondition } from 'src/__shared__/page';
import {
  SearchDTO,
  ISearchQueryService,
} from 'src/app/query-service-interface/search-task-query-service';

export class SearchQueryService implements ISearchQueryService {
  private readonly prismaClient: PrismaClient;
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

    // const query = (arr: string[]) =>
    //   arr.reduce((previous, current) => {
    //     return `
    //       ${previous}
    //       AND
    //         "public"."MemberOnTask"."taskId" = ${current}
    //     `;
    //   }, '');

    interface Results {
      id: string;
      name: string;
      email: string;
    }

    const results: Results[] = await this.prismaClient.$queryRaw(
      Prisma.sql`
      SELECT
        "public"."Member"."id",
        "public"."Member"."name",
        "public"."Member"."email"
      FROM
        "public"."MemberOnTask"
      LEFT JOIN
        "public"."Member"
      ON
        "public"."MemberOnTask"."memberId" = "public"."Member"."id"
      WHERE
        "public"."MemberOnTask"."status" = ${taskStatus}
      AND
        "public"."MemberOnTask"."taskId" = ${taskIds[0]}
      AND
        "public"."MemberOnTask"."taskId" = ${taskIds[0]}
      AND
        "public"."MemberOnTask"."taskId" = ${taskIds[0]}
      ORDER BY
        "public"."MemberOnTask"."id" ASC LIMIT ${pageSize} OFFSET ${pageNumber}
      `
    );

    const paging: Paging = {
      totalCount: results.length,
      pageSize: pageSize,
      pageNumber: pageNumber,
    };

    return {
      items: results.map((result) => {
        return new SearchDTO({
          id: result.id,
          name: result.name,
          email: result.email,
        });
      }),
      paging: paging,
    };
  }
}
