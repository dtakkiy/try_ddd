import { Member } from 'src/domain/member/member';
import { IMemberRepository } from 'src/domain/member/member-repository-interface';
import {
  MemberStatus,
  MemberStatusType,
} from 'src/domain/member/member-status';

interface Params {
  id: string;
  status: string;
}

export class UpdateMemberStatusUseCase {
  private readonly memberRepository: IMemberRepository;
  constructor(memberRepository: IMemberRepository) {
    this.memberRepository = memberRepository;
  }

  public execute = async (params: Params): Promise<Member> => {
    const { id, status } = params;
    const member = await this.memberRepository.getById(id);

    if (!member) {
      throw new Error('member does not exist.');
    }

    member.setStatus(new MemberStatus(status));

    const updateMember = await this.memberRepository.update(member);

    return updateMember;
  };
}
