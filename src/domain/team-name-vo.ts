export class TeamNameVO {
  MIN_NAME_LENGTH = 1;
  MAX_NAME_LENGTH = 3;

  constructor(private readonly name: string) {
    this.validateTeamName(name);
    this.name = name;
  }

  public getName() {
    return this.name;
  }

  private validateTeamName(name: string) {
    if (
      name.length < this.MIN_NAME_LENGTH ||
      name.length > this.MAX_NAME_LENGTH
    ) {
      throw new Error(`team name is not appropriate.${name}`);
    }

    const pattern = '^[0-9]{1,3}$';
    if (!name.match(pattern)) {
      throw new Error(`team name is not appropriate.${name}`);
    }
  }
}
