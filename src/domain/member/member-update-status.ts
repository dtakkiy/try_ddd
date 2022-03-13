import { Member } from './member';
import { IMemberRepository } from './member-repository-interface';
import { MemberStatus } from './member-status';

export class MemberUpdateStatus {
  private readonly memberRepository: IMemberRepository;

  constructor(memberRepository: IMemberRepository) {
    this.memberRepository = memberRepository;
  }

  public execute = async (
    member: Member,
    status: MemberStatus
  ): Promise<void> => {
    if (status.equals(member.status)) {
      throw new Error('既にステータスは変更されています');
    }

    const { id, name, email } = member;
    const updateMember = Member.create({ id, name, email, status });
    await this.memberRepository.update(updateMember);
  };
}
