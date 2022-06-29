export class TeamNameVO {
  private readonly _value: string;
  constructor(name: string) {
    this.validateTeamName(name);
    this._value = name;
  }

  public getName() {
    return this._value;
  }

  private validateTeamName(name: string) {
    const pattern = '^[0-9]{1,3}$';
    if (!name.match(pattern)) {
      throw new Error(`team name is not appropriate.${name}`);
    }
  }
}
