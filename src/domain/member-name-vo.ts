export class MemberNameVO {
  constructor(private readonly name: string) {
    this.validateName(name);
    this.name = name;
  }

  private validateName(name: string) {
    if (name === '') {
      throw new Error('name is empty.');
    }
  }

  public getName() {
    return this.name;
  }
}
