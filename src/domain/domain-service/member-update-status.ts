import { Member } from '../member';
import { IMemberRepository } from '../repository-interface/member-repository-interface';
import { MemberStatusVO } from '../member-status-vo';

export class MemberUpdateStatus {
  private readonly memberRepository: IMemberRepository;

  constructor(memberRepository: IMemberRepository) {
    this.memberRepository = memberRepository;
  }

  public execute = async (
    member: Member,
    status: MemberStatusVO
  ): Promise<void> => {
    if (status.equals(member.status)) {
      throw new Error('status has already been changed.');
    }

    const { id, name, email } = member;
    const updateMember = new Member({ id, name, email, status });
    await this.memberRepository.update(updateMember);
  };
}