import { Pair } from './pair';

interface ITeam {
  id: string;
  name: string;
  pairList: Pair[];
}

export class Team {
  private props: ITeam;
  constructor(props: ITeam) {
    this.props = props;
  }

  public get name() {
    return this.props.name;
  }

  public get pairList(): Pair[] {
    return this.props.pairList;
  }

  public equals = (team: Team): boolean => {
    return team.props.id === this.props.id;
  };

  public static create(props: ITeam) {
    this.validateTeamName(props.name);
    return new Team(props);
  }

  private static validateTeamName(name: string) {
    const pattern = '^[0-9]{1,3}$';
    if (!name.match(pattern)) {
      throw new Error();
    }
  }
}
