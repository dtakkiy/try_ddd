import { PrismaClient } from '@prisma/client';
import * as faker from 'faker';
import { MemberRepository } from 'src/infra/db/repository/member-repository';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { MemberFactory } from '../domain-service/member-factory';
import { MemberUpdateStatus } from '../domain-service/member-update-status';
import { Member } from '../member';
import { MemberEmailVO } from '../member-email-vo';
import { MemberNameVO } from '../member-name-vo';
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
    member = Member.reconstruct({
      id: faker.datatype.uuid(),
      name: new MemberNameVO('bob'),
      email: new MemberEmailVO('bob@example.com'),
      status: MemberStatusVO.create(),
    });
  });

  it('ステータス更新を実行できる', async () => {
    const memberUpdateStatus = new MemberUpdateStatus(mockMemberRepository);
    const result = await memberUpdateStatus.execute(
      member,
      new MemberStatusVO(MemberStatusType.closed)
    );

    expect(result.isSuccess()).toBeTruthy();
  });

  it('ステータスが同じである場合、エラーとなる', async () => {
    const memberUpdateStatus = new MemberUpdateStatus(mockMemberRepository);
    const result = await memberUpdateStatus.execute(
      member,
      new MemberStatusVO(MemberStatusType.active)
    );

    expect(result.isFailure()).toBeTruthy();
  });
});
