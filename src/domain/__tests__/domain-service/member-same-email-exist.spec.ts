import { PrismaClient } from '@prisma/client';
import { Identifier } from 'src/__shared__/identifier';
import { Member } from 'src/domain/member';
import { MemberEmailVO } from 'src/domain/member-email-vo';
import { MemberNameVO } from 'src/domain/member-name-vo';
import { MemberStatusVO } from 'src/domain/member-status-vo';
import { MemberRepository } from 'src/infra/db/repository/member-repository';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { MemberSameEmailExist } from '../../domain-service/member-same-email-exist';

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

    const dummyMember1 = Member.create({
      id: Identifier.generator(),
      name: new MemberNameVO('a'),
      email: new MemberEmailVO('a@example.com'),
      status: MemberStatusVO.create(),
    });

    const dummyMember2 = Member.create({
      id: Identifier.generator(),
      name: new MemberNameVO('b'),
      email: new MemberEmailVO('b@example.com'),
      status: MemberStatusVO.create(),
    });

    if (dummyMember1.isFailure()) {
      return;
    }

    if (dummyMember2.isFailure()) {
      return;
    }

    mockMemberRepository.getAll.mockResolvedValueOnce([
      dummyMember1.value,
      dummyMember2.value,
    ]);
    const memberSameEmailExist = new MemberSameEmailExist(
      email,
      mockMemberRepository
    );

    await expect(memberSameEmailExist.execute()).resolves.toBe(true);
  });

  it('指定したemailが存在しない場合', async () => {
    const email = 'a@example.com';

    const dummyMember2 = Member.create({
      id: Identifier.generator(),
      name: new MemberNameVO('b'),
      email: new MemberEmailVO('b@example.com'),
      status: MemberStatusVO.create(),
    });

    const dummyMember1 = Member.create({
      id: Identifier.generator(),
      name: new MemberNameVO('c'),
      email: new MemberEmailVO('c@example.com'),
      status: MemberStatusVO.create(),
    });

    if (dummyMember1.isFailure()) {
      return;
    }

    if (dummyMember2.isFailure()) {
      return;
    }

    mockMemberRepository.getAll.mockResolvedValueOnce([
      dummyMember1.value,
      dummyMember2.value,
    ]);
    const memberSameEmailExist = new MemberSameEmailExist(
      email,
      mockMemberRepository
    );

    await expect(memberSameEmailExist.execute()).resolves.toBe(false);
  });
});
