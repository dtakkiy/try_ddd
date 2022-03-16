import { mocked } from 'ts-jest/utils';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { PrismaClient } from '@prisma/client';
import { UpdateMemberStatusUseCase } from '../update-member-status-usecase';
import { MemberRepository } from 'src/infra/db/repository/member-repository';
import { Member } from 'src/domain/member/member';
import { Identifier } from 'src/__share__/identifier';
import { MemberStatusType } from 'src/domain/member/member-status';

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
    const name = 'test';
    const email = 'test@example.com';
    const status = MemberStatusType.active;

    // mockMemberRepository.getById(id).mockResolvedValueOnce(member);

    // const expectResponse = new Member({ name: name, email: email });
    // const usecase = new UpdateMemberStatusUseCase(mockMemberRepository);
    // return expect(usecase.execute({})).resolves.toStrictEqual([expectResponse]);
  });
});
