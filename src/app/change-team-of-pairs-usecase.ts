import { ITeamRepository } from 'src/domain/team/team-repository-interface';
import { TeamChange } from 'src/domain/team/team-change';

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

    const teamChange = new TeamChange(this.repository);
    await teamChange.changeTeamOfPair(pairId, teamId);
  }
}
