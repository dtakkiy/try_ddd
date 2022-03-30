import { Member } from 'src/domain/member/member';
import { IMemberRepository } from 'src/domain/member/member-repository-interface';
import { MemberStatus } from 'src/domain/member/member-status';
import { Pair } from 'src/domain/team/pair';
import { PairNameVO } from 'src/domain/team/pair-name-vo';
import { ITeamRepository } from 'src/domain/team/team-repository-interface';
import { TeamService } from 'src/domain/team/team-service';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { Identifier } from 'src/__shared__/identifier';
import { IEmailRepository } from './repository-interface/email-repository-interface';

interface Params {
  id: string;
  status: string;
}

export class UpdateMemberStatusUseCase {
  private readonly memberRepository: IMemberRepository;
  private readonly emailRepository: IEmailRepository;
  private readonly teamRepository: ITeamRepository;

  constructor(
    memberRepository: IMemberRepository,
    emailRepository: IEmailRepository,
    teamRepository: ITeamRepository
  ) {
    this.memberRepository = memberRepository;
    this.emailRepository = emailRepository;
    this.teamRepository = teamRepository;
  }

  public execute = async (params: Params): Promise<Member> => {
    const { id, status } = params;
    const member = await this.memberRepository.getById(id);

    if (!member) {
      throw new Error('member does not exist.');
    }

    const currentStatus = member.status.getStatus();

    // 参加者が増える
    if (
      MemberStatus.isClosedOrEndedStatus(currentStatus) &&
      MemberStatus.isActiveStatus(status)
    ) {
      const teamService = new TeamService(this.teamRepository);
      const fewestTeam = await teamService.getTeamFewestNumberOfMember();
      const fewestPair = fewestTeam.getMinMemberPair();

      if (fewestPair.getMemberCount() < 3) {
        fewestPair.addMember(member.id);
        this.teamRepository.update(fewestTeam);
      } else {
        // ペアを分割
        const deleteUsers: string[] = [];
        const currentPairMemberIdList = fewestPair.getMemberIdList();

        if (currentPairMemberIdList[2] && currentPairMemberIdList[3]) {
          deleteUsers.push(currentPairMemberIdList[2]);
          deleteUsers.push(currentPairMemberIdList[3]);

          fewestPair.deleteMember(currentPairMemberIdList[2]);
          fewestPair.deleteMember(currentPairMemberIdList[3]);
        }

        const newPairName = await teamService.generateNewPairName();

        const newPair = new Pair({
          id: Identifier.generator(),
          name: new PairNameVO(newPairName),
          memberIdList: deleteUsers,
        });

        fewestTeam.addPair(newPair);
        this.teamRepository.update(fewestTeam);
      }
    }

    // 参加者が減る
    if (
      MemberStatus.isActiveStatus(currentStatus) &&
      MemberStatus.isClosedOrEndedStatus(status)
    ) {
      // なんらかの処理
    }

    member.setStatus(new MemberStatus(status));

    const updateMember = await this.memberRepository.update(member);

    return updateMember;
  };
}
