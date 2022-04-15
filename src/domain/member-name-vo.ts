export class MemberNameVO {
  private _var: string;

  constructor(name: string) {
    this.validateName(name);
    this._var = name;
  }

  private validateName(name: string) {
    if (name === '') {
      throw new Error('name is empty.');
    }
  }

  public getValue() {
    return this._var;
  }
}
