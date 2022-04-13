import { ITeamRepository } from 'src/domain/repository/team-repository-interface';
import { TeamService } from 'src/domain/domain-service/team-service';

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

    const teamChange = new TeamService(this.repository);
    await teamChange.changeTeamOfPair(pairId, teamId);
  }
}
