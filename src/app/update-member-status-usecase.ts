import { AddMemberToFewestTeam } from 'src/domain/domain-service/team-add-member-to-fewest-team';
import { DeleteMemberFromPair } from 'src/domain/domain-service/team-delete-member-from-pair';
import { TeamMemberUpdate } from 'src/domain/domain-service/team-member-update';
import { Member } from 'src/domain/member';
import { MemberStatusVO } from 'src/domain/member-status-vo';
import { IMemberRepository } from 'src/domain/repository-interface/member-repository-interface';
import { ITeamRepository } from 'src/domain/repository-interface/team-repository-interface';
import { IEmailRepository } from './repository-interface/email-repository-interface';

interface Params {
  id: string;
  status: string;
}

export class UpdateMemberStatusUseCase {
  constructor(
    private readonly memberRepository: IMemberRepository,
    private readonly emailRepository: IEmailRepository,
    private readonly teamRepository: ITeamRepository,
    private readonly teamMemberUpdate: TeamMemberUpdate
  ) {
    this.memberRepository = memberRepository;
    this.emailRepository = emailRepository;
    this.teamRepository = teamRepository;
    this.teamMemberUpdate = teamMemberUpdate;
  }

  public execute = async (params: Params): Promise<Member> => {
    const { id, status } = params;
    const member = await this.memberRepository.getById(id);

    if (!member) {
      throw new Error('member does not exist.');
    }

    const currentStatus = member.getStatus();
    const updateMember = member.setStatus(new MemberStatusVO(status));

    // 参加者が増える
    if (
      MemberStatusVO.isClosedOrEndedStatus(currentStatus) &&
      MemberStatusVO.isActiveStatus(status)
    ) {
      const addMemberToFewestTeam = new AddMemberToFewestTeam(
        this.teamRepository,
        this.teamMemberUpdate
      );
      await addMemberToFewestTeam.execute(updateMember);
    }

    // 参加者が減る
    if (
      MemberStatusVO.isActiveStatus(currentStatus) &&
      MemberStatusVO.isClosedOrEndedStatus(status)
    ) {
      const deleteMemberFromPair = new DeleteMemberFromPair(
        this.teamRepository,
        this.emailRepository,
        this.teamMemberUpdate
      );
      await deleteMemberFromPair.execute(updateMember);
    }

    return updateMember;
  };
}
