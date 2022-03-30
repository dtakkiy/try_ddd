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

  // memberを指定したpairに変更する
  public async changePairOfMember(
    memberId: string,
    pairId: string
  ): Promise<void> {
    const currentTeam = await this.teamRepository.getByMemberId(memberId);
    const newTeam = await this.teamRepository.getByPairId(pairId);

    if (!currentTeam) {
      throw new Error('not exist.');
    }

    if (!newTeam) {
      throw new Error('not exist.');
    }

    currentTeam.deleteMember(memberId);
    newTeam.addMember(memberId);

    this.teamRepository.update(newTeam);

    return;
  }

  public async GetTeamFewestNumberOfMember(): Promise<Team> {
    const teams = await this.teamRepository.getAll();

    if (teams === null) {
      throw new Error();
    }

    return teams?.reduce((fewTeam, team) => {
      return fewTeam.getMemberCount() > team.getMemberCount() ? team : fewTeam;
    });
  }
}
