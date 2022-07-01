export class TeamNameVO {
  constructor(private readonly name: string) {
    this.validateTeamName(name);
    this.name = name;
  }

  public getName() {
    return this.name;
  }

  private validateTeamName(name: string) {
    const pattern = '^[0-9]{1,3}$';
    if (!name.match(pattern)) {
      throw new Error(`team name is not appropriate.${name}`);
    }
  }
}
