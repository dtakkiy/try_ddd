import { Member } from 'src/domain/member/member';
import { IMemberRepository } from 'src/domain/member/member-repository-interface';
import { MemberStatus } from 'src/domain/member/member-status';
import { IEmailRepository } from './repository-interface/email-repository-interface';

interface Params {
  id: string;
  status: string;
}

export class UpdateMemberStatusUseCase {
  private readonly memberRepository: IMemberRepository;
  private readonly emailRepository: IEmailRepository;
  constructor(
    memberRepository: IMemberRepository,
    emailRepository: IEmailRepository
  ) {
    this.memberRepository = memberRepository;
    this.emailRepository = emailRepository;
  }

  public execute = async (params: Params): Promise<Member> => {
    const { id, status } = params;
    const member = await this.memberRepository.getById(id);

    if (!member) {
      throw new Error('member does not exist.');
    }

    const currentStatus = member.status.getStatus();

    // 参加者が増える
    if (
      MemberStatus.isClosedOrEndedStatus(currentStatus) &&
      MemberStatus.isActiveStatus(status)
    ) {
      // なんらかの処理
    }

    // 参加者が減る
    if (
      MemberStatus.isActiveStatus(currentStatus) &&
      MemberStatus.isClosedOrEndedStatus(status)
    ) {
      // なんらかの処理
    }

    member.setStatus(new MemberStatus(status));

    const updateMember = await this.memberRepository.update(member);

    return updateMember;
  };
}
