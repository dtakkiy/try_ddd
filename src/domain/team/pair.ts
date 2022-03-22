import { Identifier } from 'src/__share__/identifier';
import { Member } from '../member/member';
import { PairNameVO } from './pair-name-vo';

interface IPair {
  id: string;
  name: PairNameVO;
  memberList: Member[];
}

export class Pair {
  private props: IPair;
  private MAX_MEMBER_NUMBER = 3;
  private MIN_MEMBER_NUMBER = 2;

  constructor(props: IPair) {
    const { id, name, memberList } = props;

    //    this.validatePairName(name);
    this.validateMemberList(memberList);

    this.props = {
      id: id ?? Identifier.generator(),
      name: name,
      memberList: memberList,
    };
    this.props = props;
  }

  public getAllProperties() {
    return {
      id: this.props.id,
      name: this.props.name.getValue(),
      memberList: this.props.memberList,
    };
  }

  public get id() {
    return this.props.id;
  }

  public get name() {
    return this.props.name;
  }

  public getMemberList(): Member[] {
    return this.props.memberList;
  }

  private validateMemberList(memberList: Member[]) {
    if (memberList.length < this.MIN_MEMBER_NUMBER) {
      throw new Error(`small number of member. ${memberList.length}`);
    }

    if (memberList.length > this.MAX_MEMBER_NUMBER) {
      throw new Error(`large number of member. ${memberList.length}`);
    }
  }

  public equals = (pair: Pair): boolean => {
    return pair.props.id === this.props.id;
  };

  // private validatePairName(name: string) {
  //   const pattern = '^[a-z]{1}$';
  //   if (!name.match(pattern)) {
  //     throw new Error(`pair name is not appropriate.${name}`);
  //   }
  // }

  public addMember = (member: Member): Pair => {
    const memberList = this.props.memberList.concat(member);
    this.validateMemberList(memberList);
    this.props.memberList = memberList;
    return this;
  };

  public deleteMember(memberId: string) {
    this.props.memberList = this.props.memberList.filter(
      (member) => member.id !== memberId
    );
  }

  public getMemberCount(): number {
    return this.props.memberList.length;
  }
}
