export const MemberStatusType = {
  active: '在籍中',
  closed: '休会中',
  ended: '退会済',
};
export class MemberStatusVO {
  private readonly _value: string;

  constructor(status: string) {
    this.validateStatus(status);
    this._value = status;
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
    return this._value;
  }

  public equals = (member: MemberStatusVO): boolean => {
    return this._value === member.getStatus();
  };

  public isJoinPair = (): boolean => {
    return this._value === MemberStatusType.active;
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
