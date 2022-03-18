export class MemberEmailVO {
  private _value: string;

  constructor(email: string) {
    this.validateEmail(email);
    this._value = email;
  }

  public getEmail() {
    return this._value;
  }

  public setEmail(email: string) {
    this.validateEmail(email);
    this._value = email;
  }

  private validateEmail(email: string) {
    if (email === '') {
      throw new Error('email is empty.');
    }
  }
}
