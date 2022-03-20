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
import { ChangeTeamOfPairsUseCase } from 'src/app/change-team-of-pairs-usecase';
import { GetTeamUseCase } from 'src/app/get-team-usecase';
import { Team } from 'src/domain/team/team';
import { TeamQueryService } from 'src/infra/db/query-service/team-query-service';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { PutTeamRequest } from './request/put-team-request';
import { GetTeamResponse } from './response/get-team-response copy';

@Controller({
  path: '/teams',
})
export class TeamController {
  @Get()
  @ApiResponse({ status: 200, type: GetTeamResponse })
  async getTeam(): Promise<GetTeamResponse> {
    const prisma = new PrismaClient();
    const qs = new TeamQueryService(prisma);
    const usecase = new GetTeamUseCase(qs);
    const result = await usecase.execute();
    const response = new GetTeamResponse({ teamDatas: result });
    return response;
  }

  @Put('/:id')
  @ApiResponse({ status: 200, type: Team })
  @ApiResponse({ status: 500 })
  async PutTeamRequest(
    @Param('id') id: string,
    @Body() putTeamDTO: PutTeamRequest
  ): Promise<void> {
    const prisma = new PrismaClient();
    const teamRepository = new TeamRepository(prisma);
    const usecase = new ChangeTeamOfPairsUseCase(teamRepository);

    try {
      await usecase.execute({
        pairId: putTeamDTO.pairId,
        teamId: id,
      });
    } catch (e: any) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: e.message },
        500
      );
    }
  }
}
