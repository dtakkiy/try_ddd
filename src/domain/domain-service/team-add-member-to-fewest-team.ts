import { Identifier } from 'src/__shared__/identifier';
import { Member } from '../member';
import { Pair } from '../pair';
import { PairNameVO } from '../pair-name-vo';
import { ITeamRepository } from '../repository-interface/team-repository-interface';
import { Team } from '../team';
import { TeamMemberUpdate } from './team-member-update';
import { TeamService } from './team-service';

export class AddMemberToFewestTeam {
  private teamRepository: ITeamRepository;
  private readonly teamMemberUpdate: TeamMemberUpdate;

  constructor(
    teamRepository: ITeamRepository,
    teamMemberUpdate: TeamMemberUpdate
  ) {
    this.teamRepository = teamRepository;
    this.teamMemberUpdate = teamMemberUpdate;
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

      const newPairName = await teamService.createNewPairName(fewestTeam.id);

      const newPair = new Pair({
        id: Identifier.generator(),
        name: new PairNameVO(newPairName),
        memberIdList: deleteUsers,
      });

      fewestTeam.addPair(fewestPair);
      fewestTeam.addPair(newPair);
    }

    await this.teamMemberUpdate.update({
      team: fewestTeam,
      member: member,
    });

    return fewestTeam;
  }
}
