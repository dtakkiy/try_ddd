export class MemberEmailVO {
  constructor(private readonly email: string) {
    this.validateEmail(email);
    this.email = email;
  }

  public getEmail() {
    return this.email;
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
