import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { GetTeamUseCase } from 'src/app/get-team-usecase';
import { TeamQueryService } from 'src/infra/db/query-service/team-query-service';
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
}
