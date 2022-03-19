import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { GetTeamUseCase } from 'src/app/get-team-usecase';
import { UpdateTeamUseCase } from 'src/app/update-team-usecase';
import { Team } from 'src/domain/team/team';
import { TeamQueryService } from 'src/infra/db/query-service/team-query-service';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { idText, updateTypeParameterDeclaration } from 'typescript';
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
  async PutTeamRequest(
    @Param('id') id: string,
    @Body() putTeamDTO: PutTeamRequest
  ): Promise<Team> {
    const prisma = new PrismaClient();
    const teamRepository = new TeamRepository(prisma);
    const usecase = new UpdateTeamUseCase(teamRepository);

    const team = await usecase.execute({
      id: id,
      name: putTeamDTO.name,
    });
    return team;
  }
}
