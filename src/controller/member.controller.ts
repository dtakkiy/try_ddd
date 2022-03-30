import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { CreateMemberUseCase } from 'src/app/create-member-usecase';
import { GetMemberListUseCase } from 'src/app/get-member-list-usecase';
import { UpdateMemberStatusUseCase } from 'src/app/update-member-status-usecase';
import { Member } from 'src/domain/member/member';
import { MemberQueryService } from 'src/infra/db/query-service/member-query-service';
import { MemberRepository } from 'src/infra/db/repository/member-repository';
import { ProgressRepository } from 'src/infra/db/repository/progress-repository';
import { TaskRepository } from 'src/infra/db/repository/task-repository';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { EmailRepository } from 'src/infra/email/email-repository';
import { PostMemberRequest } from './request/post-member-request';
import { PutMemberRequest } from './request/put-member-request';
import { GetMemberResponse } from './response/get-member-response';

@Controller({
  path: '/members',
})
export class MemberController {
  @Get()
  @ApiResponse({ status: 200, type: GetMemberResponse })
  async getMember(): Promise<GetMemberResponse> {
    const prisma = new PrismaClient();
    const qs = new MemberQueryService(prisma);
    const usecase = new GetMemberListUseCase(qs);
    const result = await usecase.execute();
    const response = new GetMemberResponse({ memberDatas: result });
    return response;
  }

  @Post()
  @ApiResponse({ status: 200, type: GetMemberResponse })
  async postMember(@Body() postMemberDTO: PostMemberRequest): Promise<Member> {
    const prisma = new PrismaClient();
    const memberRepository = new MemberRepository(prisma);
    const progressRepository = new ProgressRepository(prisma);
    const taskRepository = new TaskRepository(prisma);

    const usecase = new CreateMemberUseCase(
      memberRepository,
      progressRepository,
      taskRepository
    );
    const member = await usecase.execute({
      name: postMemberDTO.name,
      email: postMemberDTO.email,
    });
    return member;
  }

  @Put('/:id')
  @ApiResponse({ status: 200, type: Member })
  async PutMember(
    @Param('id') id: string,
    @Body() putMemberDTO: PutMemberRequest
  ): Promise<Member> {
    const prisma = new PrismaClient();
    const memberRepository = new MemberRepository(prisma);
    const emailRepository = new EmailRepository();
    const teamRepository = new TeamRepository(prisma);
    const usecase = new UpdateMemberStatusUseCase(
      memberRepository,
      emailRepository,
      teamRepository
    );

    const member = await usecase.execute({
      id: id,
      status: putMemberDTO.status,
    });
    return member;
  }
}
