export class TeamNameVO {
  private _value: string;
  constructor(name: string) {
    this.validateTeamName(name);
    this._value = name;
  }

  public getValue() {
    return this._value;
  }

  public setValue(name: string) {
    this._value = name;
  }

  private validateTeamName(name: string) {
    const pattern = '^[0-9]{1,3}$';
    if (!name.match(pattern)) {
      throw new Error(`team name is not appropriate.${name}`);
    }
  }
}
