export const MemberStatusType = {
  active: '在籍中',
  closed: '休会中',
  ended: '退会済',
};
export class MemberStatus {
  private readonly _value: string;

  constructor(status: string) {
    this.validateStatus(status);
    this._value = status;
  }

  public static create() {
    return new MemberStatus(MemberStatusType.active);
  }

  private validateStatus(status: string) {
    if (Object.values(MemberStatusType).includes(status) === false) {
      throw new Error(`no applicable member status. ${status}`);
    }
  }

  public getStatus() {
    return this._value;
  }

  public equals = (member: MemberStatus): boolean => {
    return this._value === member.getStatus();
  };

  public isJoinPair = (): boolean => {
    return this._value === MemberStatusType.active;
  };
}
