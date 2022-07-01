export class PairNameVO {
  constructor(private readonly name: string) {
    this.validatePairName(name);
    this.name = name;
  }

  public getName() {
    return this.name;
  }

  private validatePairName(name: string) {
    const pattern = '^[a-z]{1}$';
    if (!name.match(pattern)) {
      throw new Error(`pair name is not appropriate.${name}`);
    }
  }
}
