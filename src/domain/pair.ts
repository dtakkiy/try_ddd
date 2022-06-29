import { Identifier } from 'src/__shared__/identifier';
import { PairNameVO } from './pair-name-vo';

interface IPair {
  id: string;
  name: PairNameVO;
  memberIdList: string[];
}

export class Pair {
  private props: IPair;
  private MAX_MEMBER_NUMBER = 3;
  private MIN_MEMBER_NUMBER = 2;

  constructor(props: IPair) {
    const { id, name, memberIdList } = props;
    this.validateMemberIdList(memberIdList);

    this.props = {
      id: id ?? Identifier.generator(),
      name: name,
      memberIdList: memberIdList,
    };
    this.props = props;
  }

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
    if (memberIdList.length < this.MIN_MEMBER_NUMBER) {
      throw new Error(`small number of member. ${memberIdList.length}`);
    }

    if (memberIdList.length > this.MAX_MEMBER_NUMBER) {
      throw new Error(`large number of member. ${memberIdList.length}`);
    }
  }

  public validateMemberCount() {
    if (this.getMemberCount() < this.MIN_MEMBER_NUMBER) {
      throw new Error('current number of member in a pair is too small.');
    }

    if (this.getMemberCount() > this.MAX_MEMBER_NUMBER) {
      throw new Error('current number of member in a pair is too large.');
    }
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
