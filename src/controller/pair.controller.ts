import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { GetPairUseCase } from 'src/app/get-pair-usecase';
import { PairQueryService } from 'src/infra/db/query-service/pair-query-service';
import { GetPairResponse } from './response/get-pair-response';

@Controller({
  path: '/pairs',
})
export class PairController {
  @Get()
  @ApiResponse({ status: 200, type: GetPairResponse })
  async getPair(): Promise<GetPairResponse> {
    const prisma = new PrismaClient();
    const qs = new PairQueryService(prisma);
    const usecase = new GetPairUseCase(qs);
    const result = await usecase.execute();
    const response = new GetPairResponse({ pairDatas: result });
    return response;
  }
}
