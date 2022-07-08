export class PairNameVO {
  NAME_LENGTH = 1;

  constructor(private readonly name: string) {
    this.validatePairName(name);
    this.name = name;
  }

  public getName() {
    return this.name;
  }

  private validatePairName(name: string) {
    if (name.length !== this.NAME_LENGTH) {
      throw new Error(`pair name is not appropriate.${name}`);
    }

    const pattern = '^[a-z]{1}$';
    if (!name.match(pattern)) {
      throw new Error(`pair name is not appropriate.${name}`);
    }
  }
}
