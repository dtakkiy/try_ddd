export const MemberStatusType = {
  active: '在籍中',
  closed: '休会中',
  ended: '退会済',
};

interface IMemberStatus {
  status: string;
}

export class MemberStatus {
  public readonly props: IMemberStatus;

  constructor(props: IMemberStatus) {
    this.validateStatus(props.status);
    this.props = {
      status: props.status,
    };
  }

  public static create() {
    return new MemberStatus({ status: MemberStatusType.active });
  }

  private validateStatus(status: string) {
    if (Object.values(MemberStatusType).includes(status) === false) {
      throw new Error(`no applicable member status. ${status}`);
    }
  }

  public get status() {
    return this.props.status;
  }

  public equals = (member: MemberStatus): boolean => {
    return this.props.status === member.props.status;
  };

  public isJoinPair = (): boolean => {
    return this.props.status === MemberStatusType.active;
  };
}
