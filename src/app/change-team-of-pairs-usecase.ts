import { ITeamRepository } from 'src/domain/team/team-repository-interface';
import { TeamService } from 'src/domain/team/team-service';

interface Params {
  pairId: string;
  teamId: string;
}

export class ChangeTeamOfPairsUseCase {
  private repository: ITeamRepository;
  constructor(repository: ITeamRepository) {
    this.repository = repository;
  }

  public async execute(params: Params): Promise<void> {
    const { pairId, teamId } = params;

    const teamService = new TeamService(this.repository);
    await teamService.changeTeamOfPair(pairId, teamId);
  }
}
