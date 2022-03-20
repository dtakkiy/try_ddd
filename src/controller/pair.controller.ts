import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { ChangePairOfMemberUseCase } from 'src/app/change-pairs-of-member-usecase';
import { GetPairUseCase } from 'src/app/get-pair-usecase';
import { PairQueryService } from 'src/infra/db/query-service/pair-query-service';
import { MemberRepository } from 'src/infra/db/repository/member-repository';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { PutPairRequest } from './request/put-pair-request';
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

  @Put('/:id')
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 500 })
  async PutPairRequest(
    @Param('id') id: string,
    @Body() putTeamDTO: PutPairRequest
  ): Promise<void> {
    const prisma = new PrismaClient();
    const teamRepository = new TeamRepository(prisma);
    const memberRepository = new MemberRepository(prisma);
    const usecase = new ChangePairOfMemberUseCase(
      teamRepository,
      memberRepository
    );

    try {
      await usecase.execute({
        pairId: id,
        memberId: putTeamDTO.memberId,
      });
    } catch (e: any) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: e.message },
        500
      );
    }
  }
}
