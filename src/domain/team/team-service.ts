import { Team } from './team';
import { ITeamRepository } from './team-repository-interface';

export class TeamService {
  private teamRepository: ITeamRepository;
  constructor(teamRepository: ITeamRepository) {
    this.teamRepository = teamRepository;
  }

  // Pairを指定したTeamに変更する
  public async changeTeamOfPair(pairId: string, teamId: string): Promise<Team> {
    const currentTeam = await this.teamRepository.getByPairId(pairId);
    const newTeam = await this.teamRepository.getById(teamId);

    if (!currentTeam) {
      throw new Error('team does not exist.');
    }

    if (!newTeam) {
      throw new Error('team does not exist');
    }

    const pair = currentTeam.getPair(pairId);
    currentTeam.deletePair(pairId);
    newTeam.addPair(pair);

    this.teamRepository.update(currentTeam);
    this.teamRepository.update(newTeam);

    return newTeam;
  }

  // // memberを指定したpairに変更する
  // public async changePairOfMember(
  //   memberId: string,
  //   pairId: string
  // ): Promise<void> {
  //   // 現在のペアを特定
  //   // 新しいペアを特定

  //   // null判定

  //   // メンバーの情報を取得
  //   // 既存のペアよりメンバーを削除
  //   // 新しいペアに追加

  //   // 新しいチームを保存

  //   return;
  // }
}
