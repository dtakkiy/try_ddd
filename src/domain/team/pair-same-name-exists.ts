import { ITeamRepository } from './team-repository-interface';

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
    if (team === null) {
      return false;
    }

    return team.getPairList().some((pair) => {
      pair.name.getValue() === pairName;
    });
  }

  public async getPairNameListByTeamId(teamId: string): Promise<string[]> {
    const team = await this.repository.getById(teamId);
    if (team === null) {
      return [];
    }

    return team.getPairList().map((pair) => pair.name.getValue());
  }
}
