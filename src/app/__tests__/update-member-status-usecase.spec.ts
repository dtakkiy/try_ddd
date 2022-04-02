import { mocked } from 'ts-jest/utils';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { PrismaClient } from '@prisma/client';
import { UpdateMemberStatusUseCase } from '../update-member-status-usecase';
import { MemberRepository } from 'src/infra/db/repository/member-repository';
import { Member } from 'src/domain/member/member';
import { Identifier } from 'src/__shared__/identifier';
import {
  MemberStatus,
  MemberStatusType,
} from 'src/domain/member/member-status';
import { MemberEmailVO } from 'src/domain/member/member-email-vo';
import { MemberNameVO } from 'src/domain/member/member-name-vo';
import { EmailRepository } from 'src/infra/email/email-repository';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { TeamMemberUpdate } from 'src/domain/team/team-member-update';
import { Pair } from 'src/domain/team/pair';
import { PairNameVO } from 'src/domain/team/pair-name-vo';
import { MemberFactory } from 'src/domain/member/member-factory';
import { TeamFactory } from 'src/domain/team/team-factory';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/member-repository');
jest.mock('src/infra/email/email-repository');
jest.mock('src/infra/db/repository/team-repository');
jest.mock('src/domain/team/team-member-update');

describe('【ユースケース】参加者の在籍ステータスを変更する', () => {
  let mockMemberRepository: MockedObjectDeep<MemberRepository>;
  let mockEmailRepository: MockedObjectDeep<EmailRepository>;
  let mockTeamRepository: MockedObjectDeep<TeamRepository>;
  let mockTeamMemberUpdate: MockedObjectDeep<TeamMemberUpdate>;

  beforeAll(() => {
    const prisma = new PrismaClient();
    mockMemberRepository = mocked(new MemberRepository(prisma), true);
    mockEmailRepository = mocked(new EmailRepository(), true);
    mockTeamRepository = mocked(new TeamRepository(prisma), true);
    mockTeamMemberUpdate = mocked(new TeamMemberUpdate(prisma), true);
  });

  it('正常系', async () => {
    const memberId = Identifier.generator();
    const name = new MemberNameVO('test');
    const email = new MemberEmailVO('test@example.com');
    const status = MemberStatus.create();
    const member = new Member({ id: memberId, name, email, status });

    const member2 = MemberFactory.execute({
      name: 'taro',
      email: 'taro@example.com',
    });

    const member3 = MemberFactory.execute({
      name: 'jiro',
      email: 'jiro@example.com',
    });

    const pairData = new Pair({
      id: Identifier.generator(),
      name: new PairNameVO('a'),
      memberIdList: [memberId, member2.id, member3.id],
    });

    const team = TeamFactory.execute({
      id: Identifier.generator(),
      name: '1',
      pairList: [pairData],
    });

    mockMemberRepository.getById.mockResolvedValueOnce(member);
    const updateMember = new Member({ id: memberId, name, email, status });
    updateMember.setStatus(new MemberStatus(MemberStatusType.closed));
    mockMemberRepository.update.mockResolvedValueOnce(updateMember);
    mockTeamRepository.getPairIdByMemberId.mockResolvedValueOnce(pairData);
    mockTeamRepository.getByMemberId.mockResolvedValueOnce(team);

    const params = {
      id: memberId,
      status: MemberStatusType.closed,
    };

    const usecase = new UpdateMemberStatusUseCase(
      mockMemberRepository,
      mockEmailRepository,
      mockTeamRepository,
      mockTeamMemberUpdate
    );

    const result = await usecase.execute(params);
    expect(result.id).toBe(updateMember.id);
  });
});
