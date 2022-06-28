import { ITeamRepository } from 'src/domain/repository-interface/team-repository-interface';
import { Team } from 'src/domain/team';

interface Params {
  id: string;
  name: string;
}

export class UpdateTeamUseCase {
  constructor(private readonly teamRepository: ITeamRepository) {
    this.teamRepository = teamRepository;
  }

  public async execute(params: Params): Promise<Team> {
    const { id, name } = params;

    const team = await this.teamRepository.getById(id);

    if (!team) {
      throw new Error('team does not exists.');
    }

    const newTeam = team.setName(name);
    const updateTeam = await this.teamRepository.update(newTeam);
    return updateTeam;
  }
}
