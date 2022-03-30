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

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/member-repository');
jest.mock('src/infra/email/email-repository');
jest.mock('src/infra/db/repository/team-repository');

describe('【ユースケース】参加者の在籍ステータスを変更する', () => {
  let mockMemberRepository: MockedObjectDeep<MemberRepository>;
  let mockEmailRepository: MockedObjectDeep<EmailRepository>;
  let mockTeamRepository: MockedObjectDeep<TeamRepository>;

  beforeAll(() => {
    const prisma = new PrismaClient();
    mockMemberRepository = mocked(new MemberRepository(prisma), true);
    mockEmailRepository = mocked(new EmailRepository(), true);
    mockTeamRepository = mocked(new TeamRepository(prisma), true);
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

    const usecase = new UpdateMemberStatusUseCase(
      mockMemberRepository,
      mockEmailRepository,
      mockTeamRepository
    );
    return expect(usecase.execute(params)).resolves.toBe(updateMember);
  });

  it('参加者が増加する場合', async () => {
    // x ①ステータス変更メンバーのステータス値を確認
    // x ②最も人数が少ないチームIDを取得
    // x ③最も少ないペアを取得
    // ④ペアに追加する
    // ⑤存在する全てのペアが上限の4名に達している場合、2-2でペア分割。
    // ⑥分割する場合、ペアの追加が必要。
    // ⑦追加するペア名は、既存名と重複を避ける必要あり。
    // ⑧確認後、ペアを追加する。
  });

  it('参加者が減少する場合', async () => {
    // ①ステータス変更メンバーのステータス値を確認
    // ②チームが2名以下になる場合、管理者にメール送信。通知内容は、どの参加者が減ったか？どのチームが2名以下なのか、そのチームの現在の人数。 >> this.emailRepository.sendMail(???)
    // ③ペアの人数を確認。
    // ④ペアの人数が1名の場合、同ペアを解散。解散ペアのメンバーを返す。
    // ⑤解散したペアのメンバーを他のペアに合流させる。
    // ⑥合流先は、同じチームのの人数が少ないペア。人数が同じ場合、合流先はランダム選択
    // ⑦合流可能ペアが存在しない場合、管理者にメール連絡 >> this.emailRepository.sendMail(???)
  });
});
