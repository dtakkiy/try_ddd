import { Identifier } from 'src/__share__/identifier';
import { Member } from '../member/member';

interface IPair {
  id: string;
  name: string;
  memberList: Member[];
}

export class Pair {
  private props: IPair;
  constructor(props: IPair) {
    const { id, name, memberList } = props;

    this.validatePairName(name);
    this.validateMemberList(memberList);

    this.props = {
      id: id ?? Identifier.generator(),
      name: name,
      memberList: memberList,
    };
    this.props = props;
  }

  public get name() {
    return this.props.name;
  }

  public get memberList(): Member[] {
    return this.props.memberList;
  }

  private validateMemberList(memberList: Member[]) {
    if (memberList.length <= 1) {
      throw new Error(`small number of member. ${memberList.length}`);
    }

    if (memberList.length >= 4) {
      throw new Error(`large number of member. ${memberList.length}`);
    }
  }

  public equals = (pair: Pair): boolean => {
    return pair.props.id === this.props.id;
  };

  public addMember = (member: Member): Pair => {
    const memberList = this.props.memberList.concat(member);
    this.validateMemberList(memberList);
    this.props.memberList = memberList;
    return this;
  };

  private validatePairName(name: string) {
    const pattern = '^[a-z]{1}$';
    if (!name.match(pattern)) {
      throw new Error(`pair name is not appropriate.${name}`);
    }
  }
}
