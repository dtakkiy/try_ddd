import { ITeamRepository } from '../team/team-repository-interface';
import { IMemberRepository } from './member-repository-interface';

export class MemberService {
  private teamRepository: ITeamRepository;
  private memberRepository: IMemberRepository;
  constructor(
    teamRepository: ITeamRepository,
    memberRepository: IMemberRepository
  ) {
    this.teamRepository = teamRepository;
    this.memberRepository = memberRepository;
  }

  // memberを指定したpairに変更する
  public async changePairOfMember(
    memberId: string,
    pairId: string
  ): Promise<void> {
    // 現在のペアを特定
    // 新しいペアを特定
    const currentTeam = this.teamRepository.getByMemberId(memberId);
    const newTeam = this.teamRepository.getByPairId(pairId);

    // null判定
    if (!currentTeam) {
      throw new Error('not exist.');
    }

    if (!newTeam) {
      throw new Error('not exist.');
    }

    // メンバーの情報を取得
    // 既存のペアよりメンバーを削除
    // 新しいペアに追加

    // 新しいチームを保存

    return;
  }
}
