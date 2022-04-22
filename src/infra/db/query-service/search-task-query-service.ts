import { Prisma, PrismaClient } from '@prisma/client';
import {
  SearchDTO,
  ISearchQueryService,
} from 'src/app/query-service-interface/search-task-query-service';
import { Page, Paging, PagingCondition } from 'src/domain/__shared__/page';
import { DomainError, Result, Success } from 'src/__shared__/result';

export class SearchQueryService implements ISearchQueryService {
  private readonly prismaClient: PrismaClient;
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async findByTaskIdAndTaskStatus(
    taskIdList: string,
    taskStatus: string,
    pagingCondition: PagingCondition
  ): Promise<Result<Page<SearchDTO>, DomainError>> {
    const pageSize = pagingCondition.pageSize;
    const pageNumber = pagingCondition.pageNumber;

    if (typeof taskStatus !== 'string') {
      taskStatus = '未着手'; // タスクステータスが未入力だった場合、値を「未完了」とする
    }

    let taskIds: string[] = [];

    if (typeof taskIdList !== 'undefined') {
      if (!taskIdList.includes(',')) {
        taskIds.push(taskIdList);
      } else {
        taskIds = taskIdList.split(',');
      }
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

    let results: Results[];

    if (taskIds.length > 0) {
      results = await this.prismaClient.$queryRaw(
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
      ORDER BY
        "public"."MemberOnTask"."id" ASC LIMIT ${pageSize} OFFSET ${pageNumber}
      `
      );
    } else {
      results = await this.prismaClient.$queryRaw(
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
      ORDER BY
        "public"."MemberOnTask"."id" ASC LIMIT ${pageSize} OFFSET ${pageNumber}
      `
      );
    }

    const paging: Paging = {
      totalCount: results.length,
      pageSize: pageSize,
      pageNumber: pageNumber,
    };

    return new Success({
      items: results.map((result) => {
        return new SearchDTO({
          id: result.id,
          name: result.name,
          email: result.email,
        });
      }),
      paging: paging,
    });
  }
}
