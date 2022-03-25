import { ITeamRepository } from 'src/domain/team/team-repository-interface';
import { TeamChange } from 'src/domain/team/team-change';

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

    const teamChange = new TeamChange(this.teamRepository);

    await teamChange.changePairOfMember(memberId, pairId);
  }
}
