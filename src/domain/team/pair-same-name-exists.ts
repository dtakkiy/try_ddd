import { ITeamRepository } from './team-repository-interface';

interface Props {
  pairName: string;
  repository: ITeamRepository;
}

export class PairSameNameExist {
  private readonly repository: ITeamRepository;
  private readonly pairName: string;

  constructor(props: Props) {
    this.repository = props.repository;
    this.pairName = props.pairName;
  }

  public async execute(teamId: string): Promise<boolean> {
    const team = await this.repository.getById(teamId);
    if (team === null) {
      return false;
    }

    return team.getPairList().some((pair) => {
      pair.name.getValue() === this.pairName;
    });
  }
}
