import { Identifier } from 'src/__shared__/identifier';
import {
  DomainError,
  Failure,
  NonError,
  Result,
  Success,
} from 'src/__shared__/result';
import { Pair } from './pair';
import { TeamNameVO } from './team-name-vo';

interface ITeam {
  id: string;
  name: TeamNameVO;
  pairList: Pair[];
}

export class Team {
  MIN_MEMBER_NUMBER = 3;

  private constructor(private props: ITeam) {
    const { id, name, pairList } = props;

    this.props = {
      id: id ?? Identifier.generator(),
      name: name,
      pairList: pairList,
    };
  }

  public static create = (props: ITeam): Result<Team, DomainError> => {
    try {
      const team = new Team(props);
      return new Success(team);
    } catch (e: any) {
      return new Failure(String(e.message));
    }
  };

  // DBなどの値からインスタンスを再構成するためのメソッド
  public static reconstruct = (props: ITeam): Team => {
    return new Team(props);
  };

  public getAllProperties() {
    return {
      id: this.props.id,
      name: this.props.name.getName(),
      pairList: [...this.props.pairList],
    };
  }

  public get id() {
    return this.props.id;
  }

  public getName() {
    return this.props.name.getName();
  }

  public updateName(newName: string): Team {
    const { id, pairList } = this.getAllProperties();

    return new Team({
      id: id,
      name: new TeamNameVO(newName),
      pairList: pairList,
    });
  }

  public getPair(pairId: string): Result<Pair, DomainError> {
    const result = this.props.pairList.find((pair) => pair.id === pairId);

    if (!result) {
      return new Failure('pair not found');
    }

    return new Success(result);
  }

  public deletePair(pairId: string) {
    this.props.pairList = this.props.pairList.filter(
      (pair) => pair.id !== pairId
    );
  }

  public getPairList(): Pair[] {
    return [...this.props.pairList];
  }

  public getMemberCount(): number {
    return this.props.pairList.reduce(
      (prev, current) => prev + current.getMemberCount(),
      0
    );
  }

  public isSameTeam = (team: Team): boolean => {
    return team.props.id === this.props.id;
  };

  public getPairCount(): number {
    return this.props.pairList.length;
  }

  public addPair(pair: Pair) {
    this.props.pairList.push(pair);
  }

  public deleteMember(memberId: string): Result<NonError, DomainError> {
    const pair = this.getPairByMemberId(memberId);
    if (!pair) {
      return new Failure('pair do not exist.');
    }

    pair.deleteMember(memberId);
    const resultPairCount = this.validatePairMemberCount();
    if (resultPairCount.isFailure()) {
      return new Failure(resultPairCount.err);
    }

    const resultTeamCount = this.validateTeamMemberCount();
    if (resultTeamCount.isFailure()) {
      return new Failure(resultTeamCount.err);
    }

    return new Success(null);
  }

  public getPairByMemberId(memberId: string) {
    return this.props.pairList.find((pair) => pair.isMemberExist(memberId));
  }

  private validatePairMemberCount(): Result<NonError, DomainError> {
    this.props.pairList.forEach((pair) => {
      const result = pair.validateMemberCount();
      if (result.isFailure()) {
        return result;
      }
    });
    return new Success(null);
  }

  private validateTeamMemberCount(): Result<NonError, DomainError> {
    const memberCount = this.getMemberCount();
    if (memberCount < this.MIN_MEMBER_NUMBER) {
      return new Failure(
        `team must have at least ${this.MIN_MEMBER_NUMBER} member.`
      );
    }

    return new Success(null);
  }

  public addMember(memberId: string): Result<Pair, DomainError> {
    // 最小人数のペアを探す
    const pair = this.getMinMemberPair();
    pair.addMember(memberId);

    const resultPairCount = this.validatePairMemberCount();
    if (resultPairCount.isFailure()) {
      return new Failure(resultPairCount.err);
    }

    const resultTeamCount = this.validateTeamMemberCount();
    if (resultTeamCount.isFailure()) {
      return new Failure(resultTeamCount.err);
    }

    return new Success(pair);
  }

  public getMinMemberPair(): Pair {
    return this.props.pairList.reduce((prev, current) =>
      prev.getMemberCount() < current.getMemberCount() ? prev : current
    );
  }
}
