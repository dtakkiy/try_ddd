import { Member } from '../member';
import { MemberEmailVO } from '../member-email-vo';
import { MemberNameVO } from '../member-name-vo';
import { MemberStatusVO } from '../member-status-vo';
import { IMemberRepository } from '../repository-interface/member-repository-interface';

export class MemberUpdateStatus {
  constructor(private readonly memberRepository: IMemberRepository) {
    this.memberRepository = memberRepository;
  }

  public execute = async (
    member: Member,
    updateStatus: MemberStatusVO
  ): Promise<void> => {
    const { id, name, email, status } = member.getAllProperties();

    if (updateStatus.equals(new MemberStatusVO(status))) {
      throw new Error('status has already been changed.');
    }

    const updateMember = new Member({
      id: id,
      name: new MemberNameVO(name),
      email: new MemberEmailVO(email),
      status: updateStatus,
    });
    await this.memberRepository.update(updateMember);
  };
}
