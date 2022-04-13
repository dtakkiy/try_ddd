export class PairNameVO {
  private _value: string;
  constructor(name: string) {
    this.validatePairName(name);
    this._value = name;
  }

  public getValue() {
    return this._value;
  }

  public setValue(name: string) {
    this.validatePairName(name);
    this._value = name;
  }

  private validatePairName(name: string) {
    const pattern = '^[a-z]{1}$';
    if (!name.match(pattern)) {
      throw new Error(`pair name is not appropriate.${name}`);
    }
  }
}
