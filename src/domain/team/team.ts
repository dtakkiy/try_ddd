import { Identifier } from 'src/__share__/identifier';
import { Pair } from './pair';
import { TeamNameVO } from './team-name-vo';

interface ITeam {
  id: string;
  name: TeamNameVO;
  pairList: Pair[];
}

export class Team {
  private props: ITeam;
  constructor(props: ITeam) {
    const { id, name, pairList } = props;
    //    this.validateTeamName(name);

    this.props = {
      id: id ?? Identifier.generator(),
      name: name,
      pairList: pairList,
    };
  }

  public getAllProperties() {
    return {
      id: this.props.id,
      name: this.props.name.getValue(),
      pairList: this.props.pairList,
    };
  }

  public get id() {
    return this.props.id;
  }

  public get name() {
    return this.props.name;
  }

  public getPair(pairId: string): Pair {
    const result = this.props.pairList.find((pair) => pair.id === pairId);

    if (!result) {
      throw new Error('pair not found');
    }

    return result;
  }

  public deletePair(pairId: string) {
    this.props.pairList = this.props.pairList.filter(
      (pair) => pair.id !== pairId
    );
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

  public getPairCount(): number {
    return this.props.pairList.length;
  }

  public addPair(pair: Pair) {
    this.props.pairList.push(pair);
  }
}
