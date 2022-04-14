import { PrismaClient } from '@prisma/client';
import { MemberRepository } from 'src/infra/db/repository/member-repository';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { MemberFactory } from '../domain-service/member-factory';
import { MemberUpdateStatus } from '../domain-service/member-update-status';
import { Member } from '../member';
import { MemberStatusType, MemberStatusVO } from '../member-status-vo';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/member-repository');

describe('member-update-statusのテスト', () => {
  let mockMemberRepository: MockedObjectDeep<MemberRepository>;
  let member: Member;

  beforeAll(() => {
    const prisma = new PrismaClient();
    mockMemberRepository = mocked(new MemberRepository(prisma), true);
  });

  beforeEach(() => {
    member = MemberFactory.execute({
      name: 'bob',
      email: 'bob@example.com',
    });
  });

  it('ステータス更新を実行できる', async () => {
    const memberUpdateStatus = new MemberUpdateStatus(mockMemberRepository);
    await expect(
      memberUpdateStatus.execute(
        member,
        new MemberStatusVO(MemberStatusType.closed)
      )
    ).resolves.toBe(undefined);
  });

  it('ステータスが同じである場合、エラーとなる', async () => {
    const memberUpdateStatus = new MemberUpdateStatus(mockMemberRepository);
    await expect(() =>
      memberUpdateStatus.execute(
        member,
        new MemberStatusVO(MemberStatusType.active)
      )
    ).rejects.toThrowError();
  });
});
