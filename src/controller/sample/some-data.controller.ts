import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { GetSomeDataResponse } from './response/get-some-data-response';
import { PostSomeDataRequest } from './request/post-some-data-request';
import { GetSomeDataUseCase } from '../../app/sample/get-some-data-usecase';
import { PostSomeDataUseCase } from '../../app/sample/post-some-data-usecase';
import { SomeDataRepository } from 'src/infra/db/repository/sample/some-data-repository';
import { PrismaClient } from '@prisma/client';
import { SomeDataQS } from 'src/infra/db/query-service/sample/some-data-qs';

@Controller({
  path: '/sample',
})
export class SampleController {
  // memo: @ApiResponseを定義しておかないとSwaggerに出力されない
  @Get()
  @ApiResponse({ status: 200, type: GetSomeDataResponse })
  async getSomeData(): Promise<GetSomeDataResponse> {
    const prisma = new PrismaClient();
    const qs = new SomeDataQS(prisma);
    const usecase = new GetSomeDataUseCase(qs);
    const result = await usecase.do();
    const response = new GetSomeDataResponse({ someDatas: result });
    return response;
  }

  @Post()
  async postSomeData(
    @Body() postSomeDataDto: PostSomeDataRequest
  ): Promise<void> {
    const prisma = new PrismaClient();
    const repo = new SomeDataRepository(prisma);
    const usecase = new PostSomeDataUseCase(repo);
    await usecase.do({
      required: postSomeDataDto.required,
      number: postSomeDataDto.number,
    });
  }
}
