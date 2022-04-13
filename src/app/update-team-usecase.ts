import { Team } from 'src/domain/team';
import { ITeamRepository } from 'src/domain/repository-interface/team-repository-interface';

interface Params {
  id: string;
  name: string;
}

export class UpdateTeamUseCase {
  private readonly teamRepository: ITeamRepository;
  constructor(teamRepository: ITeamRepository) {
    this.teamRepository = teamRepository;
  }

  public async execute(params: Params): Promise<Team> {
    const { id, name } = params;

    const team = await this.teamRepository.getById(id);

    if (!team) {
      throw new Error('team does not exists.');
    }

    team.name.setValue(name);

    const updateTeam = await this.teamRepository.update(team);
    return updateTeam;
  }
}
