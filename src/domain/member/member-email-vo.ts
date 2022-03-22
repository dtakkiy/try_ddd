import { mainModule } from 'process';

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

    const pattern =
      /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;

    if (!email.match(pattern)) {
      throw new Error('incorrect email address.');
    }
  }
}
