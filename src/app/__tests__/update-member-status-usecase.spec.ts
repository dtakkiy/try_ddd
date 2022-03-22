import { mocked } from 'ts-jest/utils';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { PrismaClient } from '@prisma/client';
import { UpdateMemberStatusUseCase } from '../update-member-status-usecase';
import { MemberRepository } from 'src/infra/db/repository/member-repository';
import { Member } from 'src/domain/member/member';
import { Identifier } from 'src/__share__/identifier';
import {
  MemberStatus,
  MemberStatusType,
} from 'src/domain/member/member-status';
import { MemberEmailVO } from 'src/domain/member/member-email-vo';
import { MemberNameVO } from 'src/domain/member/member-name-vo';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/member-repository');

describe('【ユースケース】参加者の在籍ステータスを変更する', () => {
  let mockMemberRepository: MockedObjectDeep<MemberRepository>;

  beforeAll(() => {
    const prisma = new PrismaClient();
    mockMemberRepository = mocked(new MemberRepository(prisma), true);
  });

  it('[正常系] 参加者の在籍ステータスを変更できる', () => {
    const id = Identifier.generator();
    const name = new MemberNameVO('test');
    const email = new MemberEmailVO('test@example.com');
    const status = MemberStatus.create();
    const member = new Member({ id, name, email, status });

    mockMemberRepository.getById.mockResolvedValueOnce(member);
    const updateMember = new Member({ id, name, email, status });
    updateMember.setStatus(new MemberStatus(MemberStatusType.closed));
    mockMemberRepository.update.mockResolvedValueOnce(updateMember);

    const params = {
      id: id,
      status: MemberStatusType.closed,
    };

    const usecase = new UpdateMemberStatusUseCase(mockMemberRepository);
    return expect(usecase.execute(params)).resolves.toBe(updateMember);
  });
});
