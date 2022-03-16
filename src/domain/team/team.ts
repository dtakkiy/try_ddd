import { Identifier } from 'src/__share__/identifier';
import { Pair } from './pair';

interface ITeam {
  id: string;
  name: string;
  pairList: Pair[];
}

export class Team {
  private props: ITeam;
  constructor(props: ITeam) {
    const { id, name, pairList } = props;
    this.validateTeamName(name);

    this.props = {
      id: id ?? Identifier.generator(),
      name: name,
      pairList: pairList,
    };
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

  private validateTeamName(name: string) {
    const pattern = '^[0-9]{1,3}$';
    if (!name.match(pattern)) {
      throw new Error(`team name is not appropriate.${name}`);
    }
  }
}
