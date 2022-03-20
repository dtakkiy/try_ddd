import { ITeamRepository } from 'src/domain/team/team-repository-interface';
import { TeamService } from 'src/domain/team/team-service';

interface Params {
  memberId: string;
  pairId: string;
}

export class ChangePairOfMemberUseCase {
  private teamRepository: ITeamRepository;
  constructor(teamRepository: ITeamRepository) {
    this.teamRepository = teamRepository;
  }

  public async execute(params: Params): Promise<void> {
    const { memberId, pairId } = params;

    const teamService = new TeamService(this.teamRepository);

    await teamService.changePairOfMember(memberId, pairId);
  }
}
