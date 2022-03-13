import { Member } from 'src/domain/member/member';
import { IMemberRepository } from 'src/domain/member/member-repository-interface';
import { MemberStatus } from 'src/domain/member/member-status';

interface Params {
  id: string;
  name: string;
  email: string;
  status: string;
}

export class UpdateMemberTaskUseCase {
  private readonly memberRepository: IMemberRepository;
  constructor(memberRepository: IMemberRepository) {
    this.memberRepository = memberRepository;
  }

  public execute = async (params: Params): Promise<Member> => {
    const { id, name, email, status } = params;
    const member = await this.memberRepository.getById(id);

    if (!member) {
      throw new Error();
    }

    member.setName(name);
    member.setEmail(email);
    member.setStatus(new MemberStatus({ status: status }));

    const updateMember = await this.memberRepository.save(member);

    return updateMember;
  };
}
