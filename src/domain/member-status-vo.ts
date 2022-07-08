// 在籍ステータスは、「在籍中」「休会中」「退会済」の3種類
export const MemberStatusType = {
  active: '在籍中',
  closed: '休会中',
  ended: '退会済',
};
export class MemberStatusVO {
  constructor(private readonly status: string) {
    this.validateStatus(status);
    this.status = status;
  }

  public static create() {
    return new MemberStatusVO(MemberStatusType.active);
  }

  private validateStatus(status: string) {
    if (Object.values(MemberStatusType).includes(status) === false) {
      throw new Error(`no applicable member status. ${status}`);
    }
  }

  public getStatus() {
    return this.status;
  }

  public isSameStatus = (member: MemberStatusVO): boolean => {
    return this.status === member.getStatus();
  };

  public isJoinPair = (): boolean => {
    return this.status === MemberStatusType.active;
  };

  public static isClosedOrEndedStatus(status: string): boolean {
    if (
      MemberStatusType.closed === status ||
      MemberStatusType.ended === status
    ) {
      return true;
    }

    return false;
  }

  public static isActiveStatus(status: string): boolean {
    return MemberStatusType.active === status;
  }
}
