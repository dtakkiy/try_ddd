import { PrismaClient } from '@prisma/client';
import { MemberRepository } from 'src/infra/db/repository/member-repository';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { MemberFactory } from '../member/member-factory';
import { MemberSameEmailExist } from '../member/member-same-email-exist';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/member-repository');

describe('member-same-email-existのテスト', () => {
  let mockMemberRepository: MockedObjectDeep<MemberRepository>;
  beforeAll(() => {
    const prisma = new PrismaClient();
    mockMemberRepository = mocked(new MemberRepository(prisma), true);
  });

  it('指定したemailが存在する場合', async () => {
    const email = 'a@example.com';

    const dummyMember1 = MemberFactory.execute({ name: 'a', email: email });
    const dummyMember2 = MemberFactory.execute({
      name: 'b',
      email: 'b@example.com',
    });

    mockMemberRepository.getAll.mockResolvedValueOnce([
      dummyMember1,
      dummyMember2,
    ]);
    const memberSameEmailExist = new MemberSameEmailExist(
      email,
      mockMemberRepository
    );

    await expect(memberSameEmailExist.execute()).resolves.toBe(true);
  });

  it('指定したemailが存在しない場合', async () => {
    const email = 'a@example.com';

    const dummyMember1 = MemberFactory.execute({
      name: 'c',
      email: 'c@example.com',
    });
    const dummyMember2 = MemberFactory.execute({
      name: 'b',
      email: 'b@example.com',
    });

    mockMemberRepository.getAll.mockResolvedValueOnce([
      dummyMember1,
      dummyMember2,
    ]);
    const memberSameEmailExist = new MemberSameEmailExist(
      email,
      mockMemberRepository
    );

    await expect(memberSameEmailExist.execute()).resolves.toBe(false);
  });
});
