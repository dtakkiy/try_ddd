import { Member } from '../member/member';

interface IPair {
  id: string;
  name: string;
  memberList: Member[];
}

export class Pair {
  private props: IPair;
  constructor(props: IPair) {
    this.props = props;
  }

  public get name() {
    return this.props.name;
  }

  public get memberList(): Member[] {
    return this.props.memberList;
  }

  private static validateMemberList(memberList: Member[]) {
    if (memberList.length < 2) {
      throw new Error();
    }

    if (memberList.length > 3) {
      throw new Error();
    }
  }

  public equals = (pair: Pair): boolean => {
    return pair.props.id === this.props.id;
  };

  public static create(props: IPair): Pair {
    this.validatePairName(props.name);
    this.validateMemberList(props.memberList);
    return new Pair(props);
  }

  public addMember = (member: Member): Pair => {
    const memberList = this.props.memberList.concat(member);
    Pair.validateMemberList(memberList);
    this.props.memberList = memberList;
    return this;
  };

  private static validatePairName(name: string) {
    const pattern = '^[a-z]{1}$';
    if (!name.match(pattern)) {
      throw new Error();
    }
  }
}
