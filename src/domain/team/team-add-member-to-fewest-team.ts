import { Identifier } from 'src/__shared__/identifier';
import { Member } from '../member/member';
import { Pair } from './pair';
import { PairNameVO } from './pair-name-vo';
import { Team } from './team';
import { ITeamRepository } from './team-repository-interface';
import { TeamService } from './team-service';

export class AddMemberToFewestTeam {
  private teamRepository: ITeamRepository;
  constructor(teamRepository: ITeamRepository) {
    this.teamRepository = teamRepository;
  }

  public async execute(member: Member): Promise<Team> {
    const teamService = new TeamService(this.teamRepository);
    const fewestTeam = await teamService.getTeamFewestNumberOfMember();
    const fewestPair = fewestTeam.getMinMemberPair();
    fewestTeam.deletePair(fewestPair.id);

    if (fewestPair.getMemberCount() < 3) {
      fewestPair.addMember(member.id);
      fewestTeam.addPair(fewestPair);
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

      const newPairName = await teamService.generateNewPairName(fewestTeam.id);

      const newPair = new Pair({
        id: Identifier.generator(),
        name: new PairNameVO(newPairName),
        memberIdList: deleteUsers,
      });

      fewestTeam.addPair(fewestPair);
      fewestTeam.addPair(newPair);
    }
    return fewestTeam;
  }
}
