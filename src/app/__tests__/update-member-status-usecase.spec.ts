import { PrismaClient } from '@prisma/client';
import { Identifier } from 'src/__shared__/identifier';
import { TeamMemberUpdate } from 'src/domain/domain-service/team-member-update';
import { Member } from 'src/domain/member';
import { MemberEmailVO } from 'src/domain/member-email-vo';
import { MemberNameVO } from 'src/domain/member-name-vo';
import { MemberStatusVO, MemberStatusType } from 'src/domain/member-status-vo';
import { Pair } from 'src/domain/pair';
import { PairNameVO } from 'src/domain/pair-name-vo';
import { Team } from 'src/domain/team';
import { TeamNameVO } from 'src/domain/team-name-vo';
import { MemberRepository } from 'src/infra/db/repository/member-repository';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { EmailRepository } from 'src/infra/email/email-repository';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { UpdateMemberStatusUseCase } from '../update-member-status-usecase';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/member-repository');
jest.mock('src/infra/email/email-repository');
jest.mock('src/infra/db/repository/team-repository');
jest.mock('src/domain/domain-service/team-member-update');

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
    const status = MemberStatusVO.create();
    const member = Member.create({ id: memberId, name, email, status });

    if (member.isFailure()) {
      return;
    }

    const member2 = Member.create({
      id: Identifier.generator(),
      name: new MemberNameVO('taro'),
      email: new MemberEmailVO('taro@example.com'),
      status: MemberStatusVO.create(),
    });

    const member3 = Member.create({
      id: Identifier.generator(),
      name: new MemberNameVO('jiro'),
      email: new MemberEmailVO('jiro@example.com'),
      status: MemberStatusVO.create(),
    });

    if (member2.isFailure() || member3.isFailure()) {
      return;
    }

    const pairData = Pair.create({
      id: Identifier.generator(),
      name: new PairNameVO('a'),
      memberIdList: [memberId, member2.value.id, member3.value.id],
    });
    if (pairData.isFailure()) {
      return;
    }

    const team = Team.reconstruct({
      id: Identifier.generator(),
      name: new TeamNameVO('1'),
      pairList: [pairData.value],
    });

    mockMemberRepository.getById.mockResolvedValueOnce(member.value);
    const updateMember = Member.create({ id: memberId, name, email, status });
    if (updateMember.isFailure()) {
      return;
    }

    const newMember = updateMember.value.setStatus(
      new MemberStatusVO(MemberStatusType.closed)
    );
    mockMemberRepository.update.mockResolvedValueOnce(newMember);
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
    expect(result.id).toBe(newMember.id);
  });
});
