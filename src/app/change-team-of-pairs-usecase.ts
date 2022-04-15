import { ITeamRepository } from 'src/domain/repository-interface/team-repository-interface';
import { TeamService } from 'src/domain/domain-service/team-service';

interface Params {
  pairId: string;
  teamId: string;
}

export class ChangeTeamOfPairsUseCase {
  private teamRepository: ITeamRepository;
  constructor(teamRepository: ITeamRepository) {
    this.teamRepository = teamRepository;
  }

  public async execute(params: Params): Promise<void> {
    const { pairId, teamId } = params;

    const teamChange = new TeamService(this.teamRepository);
    await teamChange.changeTeamOfPair(pairId, teamId);
  }
}
