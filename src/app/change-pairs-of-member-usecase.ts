import { IMemberRepository } from 'src/domain/member/member-repository-interface';
import { MemberService } from 'src/domain/member/member-service';
import { ITeamRepository } from 'src/domain/team/team-repository-interface';

interface Params {
  memberId: string;
  pairId: string;
}

export class ChangePairOfMemberUseCase {
  private teamRepository: ITeamRepository;
  private memberRepository: IMemberRepository;
  constructor(
    teamRepository: ITeamRepository,
    memberRepository: IMemberRepository
  ) {
    this.teamRepository = teamRepository;
    this.memberRepository = memberRepository;
  }

  public async execute(params: Params): Promise<void> {
    const { memberId, pairId } = params;

    const teamService = new MemberService(
      this.teamRepository,
      this.memberRepository
    );
    await teamService.changePairOfMember(memberId, pairId);
  }
}
