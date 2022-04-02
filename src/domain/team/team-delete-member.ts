import { Member } from '../member/member';
import { Team } from './team';
import { ITeamRepository } from './team-repository-interface';
import { TeamService } from './team-service';

export class DeleteMemberToTeam {
  private teamRepository: ITeamRepository;
  constructor(teamRepository: ITeamRepository) {
    this.teamRepository = teamRepository;
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
    return joinTeam;
  }
}
