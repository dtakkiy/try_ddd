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

  public get id() {
    return this.props.id;
  }

  public get name() {
    return this.props.name;
  }

  public getPairList(): Pair[] {
    return this.props.pairList;
  }

  public getMemberCount(): number {
    return this.props.pairList.reduce(
      (prev, current) => prev + current.getMemberCount(),
      0
    );
  }

  public getMinMemberPair(): Pair {
    return this.props.pairList.reduce((prev, current) =>
      prev.getMemberCount() < current.getMemberCount() ? prev : current
    );
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

  public getPairCount(): number {
    return this.props.pairList.length;
  }

  public addPair(pair: Pair) {
    this.props.pairList.push(pair);
  }

  public deletePair(targetPair: Pair) {
    this.props.pairList = this.props.pairList.filter(
      (pair) => pair.id === targetPair.id
    );
  }
}
