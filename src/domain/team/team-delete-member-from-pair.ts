import { IEmailRepository } from 'src/app/repository-interface/email-repository-interface';
import { Member } from '../member/member';
import { Team } from './team';
import { TeamMemberUpdate } from './team-member-update';
import { ITeamRepository } from './team-repository-interface';
import { TeamService } from './team-service';

export class DeleteMemberFromPair {
  private teamRepository: ITeamRepository;
  private readonly emailRepository: IEmailRepository;
  private readonly teamMemberUpdate: TeamMemberUpdate;
  constructor(
    teamRepository: ITeamRepository,
    emailRepository: IEmailRepository,
    teamMemberUpdate: TeamMemberUpdate
  ) {
    this.teamRepository = teamRepository;
    this.emailRepository = emailRepository;
    this.teamMemberUpdate = teamMemberUpdate;
  }

  public async execute(member: Member): Promise<Team> {
    const joinTeam = await this.teamRepository.getByMemberId(member.id);

    if (joinTeam === null) {
      throw new Error('number of team members could not be retrieved.');
    }

    const joinPair = await this.teamRepository.getPairIdByMemberId(member.id);
    if (joinPair === null) {
      throw new Error('pair information could not be retrieved.');
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
      joinTeam.deletePair(mergePair.id);
      joinTeam.addPair(mergePair);
    } else {
      // ペアの情報をアップデートする
      joinTeam.deletePair(joinPair.id);
      joinTeam.addPair(joinPair);
    }

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

    return joinTeam;
  }
}
