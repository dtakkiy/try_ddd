import { ITeamRepository } from '../repository-interface/team-repository-interface';

interface Props {
  repository: ITeamRepository;
}

export class PairSameNameExist {
  private readonly repository: ITeamRepository;

  constructor(props: Props) {
    this.repository = props.repository;
  }

  public async isPairName(pairName: string, teamId: string): Promise<boolean> {
    const team = await this.repository.getById(teamId);
    if (team === null || team === undefined) {
      return false;
    }

    return team.getPairList().some((pair) => pair.getName() === pairName);
  }

  public async getPairNameListByTeamId(teamId: string): Promise<string[]> {
    const team = await this.repository.getById(teamId);
    if (team === null || team === undefined) {
      return [];
    }

    return team.getPairList().map((pair) => pair.getName());
  }
}
