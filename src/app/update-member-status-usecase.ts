import { Member } from 'src/domain/member/member';
import { IMemberRepository } from 'src/domain/member/member-repository-interface';
import { MemberStatus } from 'src/domain/member/member-status';
import { AddMemberToFewestTeam } from 'src/domain/team/team-add-member-to-fewest-team';
import { DeleteMemberFromPair } from 'src/domain/team/team-delete-member-from-pair';
import { TeamMemberUpdate } from 'src/domain/team/team-member-update';
import { ITeamRepository } from 'src/domain/team/team-repository-interface';
import { IEmailRepository } from './repository-interface/email-repository-interface';

interface Params {
  id: string;
  status: string;
}

export class UpdateMemberStatusUseCase {
  private readonly memberRepository: IMemberRepository;
  private readonly emailRepository: IEmailRepository;
  private readonly teamRepository: ITeamRepository;
  private readonly teamMemberUpdate: TeamMemberUpdate;

  constructor(
    memberRepository: IMemberRepository,
    emailRepository: IEmailRepository,
    teamRepository: ITeamRepository,
    teamMemberUpdate: TeamMemberUpdate
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

    const currentStatus = member.status.getStatus();
    member.setStatus(new MemberStatus(status));

    // 参加者が増える
    if (
      MemberStatus.isClosedOrEndedStatus(currentStatus) &&
      MemberStatus.isActiveStatus(status)
    ) {
      const addMemberToFewestTeam = new AddMemberToFewestTeam(
        this.teamRepository
      );
      const fewestTeam = await addMemberToFewestTeam.execute(member);

      await this.teamMemberUpdate.update({
        team: fewestTeam,
        member: member,
      });
    }

    // 参加者が減る
    if (
      MemberStatus.isActiveStatus(currentStatus) &&
      MemberStatus.isClosedOrEndedStatus(status)
    ) {
      const deleteMemberFromPair = new DeleteMemberFromPair(
        this.teamRepository
      );
      const joinTeam = await deleteMemberFromPair.execute(member);

      await this.teamMemberUpdate.update({
        team: joinTeam,
        member: member,
      });

      // チームが2名以下になった場合の処理
      const joinTeamOfMember = joinTeam.getMemberCount();
      if (joinTeamOfMember <= 2) {
        const message = {
          to: 'admin@example.com',
          from: 'xxx@example.com',
          subject: 'チームの人数が2名以下です',
          html: `減った参加者ID: ${
            member.id
          }, どのチーム？: ${joinTeam.name.getValue()} 現在の人数: ${
            joinTeamOfMember - 1
          }`,
        };
        await this.emailRepository.sendMail(message);
      }
    }

    return member;
  };
}
