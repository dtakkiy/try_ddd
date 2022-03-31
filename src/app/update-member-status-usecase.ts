import { Member } from 'src/domain/member/member';
import { IMemberRepository } from 'src/domain/member/member-repository-interface';
import { MemberStatus } from 'src/domain/member/member-status';
import { Pair } from 'src/domain/team/pair';
import { PairNameVO } from 'src/domain/team/pair-name-vo';
import { TeamMemberUpdate } from 'src/domain/team/team-member-update';
import { ITeamRepository } from 'src/domain/team/team-repository-interface';
import { TeamService } from 'src/domain/team/team-service';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { Identifier } from 'src/__shared__/identifier';
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
      const teamService = new TeamService(this.teamRepository);
      const fewestTeam = await teamService.getTeamFewestNumberOfMember();
      const fewestPair = fewestTeam.getMinMemberPair();

      if (fewestPair.getMemberCount() < 3) {
        fewestPair.addMember(member.id);
        await this.teamMemberUpdate.update({
          team: fewestTeam,
          member: member,
        });
      } else {
        // ペアを分割
        const deleteUsers: string[] = [];
        const currentPairMemberIdList = fewestPair.getMemberIdList();

        if (currentPairMemberIdList[2] && currentPairMemberIdList[3]) {
          deleteUsers.push(currentPairMemberIdList[2]);
          deleteUsers.push(currentPairMemberIdList[3]);

          fewestPair.deleteMember(currentPairMemberIdList[2]);
          fewestPair.deleteMember(currentPairMemberIdList[3]);
        }

        const newPairName = await teamService.generateNewPairName();

        const newPair = new Pair({
          id: Identifier.generator(),
          name: new PairNameVO(newPairName),
          memberIdList: deleteUsers,
        });

        fewestTeam.addPair(newPair);
        await this.teamMemberUpdate.update({
          team: fewestTeam,
          member: member,
        });
      }
    }

    // 参加者が減る
    if (
      MemberStatus.isActiveStatus(currentStatus) &&
      MemberStatus.isClosedOrEndedStatus(status)
    ) {
      const joinTeam = await this.teamRepository.getByMemberId(member.id);

      if (joinTeam === null) {
        throw new Error('number of team members could not be retrieved.');
      }

      const joinPair = await this.teamRepository.getPairIdByMemberId(member.id);
      if (joinPair === null) {
        throw new Error('pair infomation could not be retrieved.');
      }

      // ユーザをリストから削除
      joinPair.deleteMember(member.id);
      const joinMemberOfNumber = joinPair.getMemberCount();

      // ペアが1名以下になった場合の処理
      if (joinMemberOfNumber <= 1) {
        // 解散するペアのメンバーを取得する
        const deleteMemberList = await joinPair.getMemberIdList();
        let deleteMemberId = '';

        if (
          typeof deleteMemberList[0] === 'undefined' ||
          deleteMemberList.length < 1
        ) {
          throw new Error(
            'failed to retrieve the member of the pair to be disbanded.'
          );
        } else {
          deleteMemberId = deleteMemberList[0];
        }
        // ペアを削除する
        joinTeam.deletePair(joinPair.id);
        // 解散したペアメンバーを同じチームの他のペアに合流させる
        const teamService = new TeamService(this.teamRepository);
        const mergePair = await teamService.getPairFewestNumberOfMember(
          joinTeam.id
        );

        // あぶれたメンバーをペアに合流させる
        mergePair.addMember(deleteMemberId);
        await this.teamMemberUpdate.update({ team: joinTeam, member: member });
      }

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
