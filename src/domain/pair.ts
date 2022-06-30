import { Identifier } from 'src/__shared__/identifier';
import {
  DomainError,
  Failure,
  NonError,
  Result,
  Success,
} from 'src/__shared__/result';
import { PairNameVO } from './pair-name-vo';

interface IPair {
  id: string;
  name: PairNameVO;
  memberIdList: string[];
}

const MAX_MEMBER_NUMBER = 3;
const MIN_MEMBER_NUMBER = 2;

export class Pair {
  private props: IPair;

  private constructor(props: IPair) {
    const { id, name, memberIdList } = props;
    this.validateMemberIdList(memberIdList);

    this.props = {
      id: id ?? Identifier.generator(),
      name: name,
      memberIdList: memberIdList,
    };
    this.props = props;
  }

  public static create = (props: IPair) => {
    try {
      return new Pair(props);
    } catch (e) {
      return null;
    }
  };

  public getAllProperties() {
    return {
      id: this.props.id,
      name: this.props.name.getName(),
      memberIdList: [...this.props.memberIdList],
    };
  }

  public get id() {
    return this.props.id;
  }

  public getName() {
    const { name } = this.getAllProperties();
    return name;
  }

  public getMemberIdList(): string[] {
    return [...this.props.memberIdList];
  }

  private validateMemberIdList(memberIdList: string[]) {
    if (memberIdList.length < MIN_MEMBER_NUMBER) {
      throw new Error(`small number of member. ${memberIdList.length}`);
    }

    if (memberIdList.length > MAX_MEMBER_NUMBER) {
      throw new Error(`large number of member. ${memberIdList.length}`);
    }
  }

  public validateMemberCount(): Result<NonError, DomainError> {
    if (this.getMemberCount() < MIN_MEMBER_NUMBER) {
      //      throw new Error('current number of member in a pair is too small.');
      return new Failure('current number of member in a pair is too small.');
    }

    if (this.getMemberCount() > MAX_MEMBER_NUMBER) {
      //      throw new Error('current number of member in a pair is too large.');
      return new Failure('current number of member in a pair is too large.');
    }
    return new Success(null);
  }

  public isEqual = (pair: Pair): boolean => {
    return pair.props.id === this.props.id;
  };

  public addMember = (memberId: string) => {
    this.props.memberIdList.push(memberId);
  };

  public deleteMember(memberId: string) {
    this.props.memberIdList = this.props.memberIdList.filter(
      (id) => id !== memberId
    );
  }

  public getMemberCount(): number {
    return this.props.memberIdList.length;
  }

  public isMemberExist(memberId: string): boolean {
    return this.props.memberIdList.includes(memberId);
  }
}
