import { ITeamRepository } from '../repository-interface/team-repository-interface';

export class TeamSameNameExist {
  constructor(private readonly teamRepository: ITeamRepository) {
    this.teamRepository = teamRepository;
  }

  public async isTeamName(teamName: string): Promise<boolean> {
    const teamAll = await this.teamRepository.getAll();
    if (teamAll === null) {
      return false;
    }

    return teamAll.some((team) => team.name.getValue() === teamName);
  }

  public async getTeamNameList(): Promise<number[]> {
    const teamAll = await this.teamRepository.getAll();
    if (teamAll === null) {
      return [];
    }

    return teamAll.map((team) => Number(team.name.getValue()));
  }
}
