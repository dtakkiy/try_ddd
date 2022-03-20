import { ITeamRepository } from './team-repository-interface';

export class TeamSameNameExist {
  private readonly repository: ITeamRepository;
  private readonly name: string;

  constructor(name: string, repository: ITeamRepository) {
    this.repository = repository;
    this.name = name;
  }

  public async execute(): Promise<boolean> {
    const teamAll = await this.repository.getAll();
    if (teamAll === null) {
      return false;
    }

    return teamAll.some((team) => team.name.getValue() === this.name);
  }
}
