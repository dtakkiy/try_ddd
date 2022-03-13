import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { CreateMemberUseCase } from 'src/app/member/create-member-usecase';
import { GetMemberListUseCase } from 'src/app/member/get-member-list-usecase';
import { UpdateMemberTaskUseCase } from 'src/app/member/update-member-usecase';
import { Member } from 'src/domain/member/member';
import { MemberQueryService } from 'src/infra/db/query-service/member-query-service';
import { MemberRepository } from 'src/infra/db/repository/member-repository';
import { PostMemberRequest } from './request/post-member-request';
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

    const usecase = new CreateMemberUseCase(memberRepository);
    const member = await usecase.execute({
      name: postMemberDTO.name,
      email: postMemberDTO.email,
    });
    return member;
  }

  @Patch('/:id/task/:taskId')
  @ApiResponse({ status: 200, type: Member })
  async PatchMemberTask(): Promise<void> {
    const prisma = new PrismaClient();
    const memberRepository = new MemberRepository(prisma);
    const usecase = new UpdateMemberTaskUseCase(memberRepository);
  }
}
