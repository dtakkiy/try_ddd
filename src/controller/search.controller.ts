import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { GetSearchTaskUseCase } from 'src/app/get-search-task-usecase';
import { SearchQueryService } from 'src/infra/db/query-service/search-task-query-service';
import { GetSearchResponse } from './response/get-search-response';

@Controller({
  path: '/search',
})

// 例) localhost:3001/search?taskStatus=000&taskIdList=111,222,333&pageNumber=2
// タスクIDのリストは、カンマ区切りで渡す
export class SearchController {
  @Get()
  @ApiResponse({ status: 200, type: GetSearchResponse })
  async getSearch(
    @Query('taskIdList') taskIdList: string,
    @Query('taskStatus') taskStatus: string,
    @Query('pageNumber') pageNumber: string
  ): Promise<GetSearchResponse | void> {
    const prisma = new PrismaClient();
    const qs = new SearchQueryService(prisma);
    const usecase = new GetSearchTaskUseCase(qs);
    const result = await usecase.execute({
      taskIdList: taskIdList,
      taskStatus: taskStatus,
      pageNumber: pageNumber,
    });
    const response = new GetSearchResponse({ searchDatas: result });
    return response;
  }
}
