export type MemberStatusType = '在籍中' | '休会中' | '退会済';

interface IMemberStatus {
  status: string;
}

export class MemberStatus {
  public readonly props: IMemberStatus;
  constructor(status: IMemberStatus) {
    this.props = status;
  }

  public static create() {
    return new MemberStatus({ status: '在籍中' });
  }

  public get status() {
    return this.props.status;
  }

  public equals = (member: MemberStatus): boolean => {
    return this.props.status === member.props.status;
  };

  public isJoinPair = (): boolean => {
    return this.props.status === '在籍中';
  };
}
