import { Identifier } from 'src/__share__/identifier';
import { Member } from '../member/member';
import { PairNameVO } from './pair-name-vo';

interface IPair {
  id: string;
  name: PairNameVO;
  //  memberList: Member[];
  memberIdList: string[];
}

export class Pair {
  private props: IPair;
  private MAX_MEMBER_NUMBER = 3;
  private MIN_MEMBER_NUMBER = 2;

  constructor(props: IPair) {
    const { id, name, memberIdList } = props;

    //    this.validatePairName(name);
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
      name: this.props.name.getValue(),
      memberIdList: this.props.memberIdList,
    };
  }

  public get id() {
    return this.props.id;
  }

  public get name() {
    return this.props.name;
  }

  public getMemberIdList(): string[] {
    return this.props.memberIdList;
  }

  private validateMemberIdList(memberIdList: string[]) {
    if (memberIdList.length < this.MIN_MEMBER_NUMBER) {
      throw new Error(`small number of member. ${memberIdList.length}`);
    }

    if (memberIdList.length > this.MAX_MEMBER_NUMBER) {
      throw new Error(`large number of member. ${memberIdList.length}`);
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

  public addMember = (memberId: string) => {
    this.props.memberIdList.push(memberId);
    this.validateMemberIdList(this.props.memberIdList);

    // const memberIdList = this.props.memberIdList.concat(member);
    // this.validateMemberIdList(memberIdList);
    // this.props.memberIdList = memberIdList;
    // return this;
  };

  public deleteMember(memberId: string) {
    this.props.memberIdList = this.props.memberIdList.filter(
      (id) => id !== memberId
    );
  }

  public getMemberCount(): number {
    return this.props.memberIdList.length;
  }
}
