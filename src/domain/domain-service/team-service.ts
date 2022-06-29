import { DSError, Failure, Result, Success } from 'src/__shared__/result';
import { Pair } from '../pair';
import { ITeamRepository } from '../repository-interface/team-repository-interface';
import { Team } from '../team';
import { PairSameNameExist } from './pair-same-name-exists';
import { TeamSameNameExist } from './team-same-name-exist';

export class TeamService {
  constructor(private readonly teamRepository: ITeamRepository) {
    this.teamRepository = teamRepository;
  }

  // Pairを指定したTeamに変更する
  public async changeTeamOfPair(pairId: string, teamId: string): Promise<Team> {
    const currentTeam = await this.teamRepository.getByPairId(pairId);
    const newTeam = await this.teamRepository.getById(teamId);

    if (!currentTeam) {
      throw new Error('team does not exist.');
    }

    if (!newTeam) {
      throw new Error('team does not exist');
    }

    const pair = currentTeam.getPair(pairId);
    currentTeam.deletePair(pairId);
    newTeam.addPair(pair);

    this.teamRepository.update(currentTeam);
    this.teamRepository.update(newTeam);

    return newTeam;
  }

  // memberを指定したpairに変更する
  public async changePairOfMember(
    memberId: string,
    pairId: string
  ): Promise<void> {
    const currentTeam = await this.teamRepository.getByMemberId(memberId);
    const newTeam = await this.teamRepository.getByPairId(pairId);

    if (!currentTeam) {
      throw new Error('not exist.');
    }

    if (!newTeam) {
      throw new Error('not exist.');
    }

    currentTeam.deleteMember(memberId);
    newTeam.addMember(memberId);

    this.teamRepository.update(newTeam);

    return;
  }

  // もっとも人数が少ないチームを取得
  public async getTeamFewestNumberOfMember(): Promise<Team | null> {
    const teams = await this.teamRepository.getAll();

    if (teams === null) {
      return null;
    }

    return teams.reduce((fewTeam, team) => {
      return fewTeam.getMemberCount() > team.getMemberCount() ? team : fewTeam;
    });
  }

  // もっとも人数が少ないペアを取得
  public async getPairFewestNumberOfMember(
    teamId: string
  ): Promise<Pair | null> {
    const team = await this.teamRepository.getById(teamId);

    if (team === null) {
      return null;
    }

    if (team.getPairList().length === 0) {
      return null;
    }
    return team.getPairList().reduce((fewPair, pair) => {
      return fewPair.getMemberCount() > pair.getMemberCount() ? pair : fewPair;
    });
  }

  public async createNewPairName(teamId: string): Promise<string> {
    // ペア名は、a-z
    const PAIR_NAME_LIST: string[] = [...'abcdefghijklmnopqrstuvwxyz'];

    const pairSameNameExist = new PairSameNameExist({
      repository: this.teamRepository,
    });

    const currentPairNameList = await pairSameNameExist.getPairNameListByTeamId(
      teamId
    );

    const blankPairName = PAIR_NAME_LIST.find((pairName) => {
      const result = currentPairNameList.some((pair) => pair === pairName);

      if (!result) {
        return pairName;
      }
    });
    return typeof blankPairName === 'string' ? blankPairName : '';
  }

  public async createNewTeamName(): Promise<Result<string, DSError>> {
    // チーム名は、1-999
    const MIN_TEAM_COUNT = 1;
    const MAX_TEAM_COUNT = 999;

    const teamSameNameExist = new TeamSameNameExist(this.teamRepository);
    const currentTeamNameList = await teamSameNameExist.getTeamNameList();

    for (let i = MIN_TEAM_COUNT; i < MAX_TEAM_COUNT; i++) {
      const result = currentTeamNameList.some((teamName) => teamName === i);

      if (!result) {
        return new Success(String(i));
      }
    }

    return new Failure('failed to generate team name.');
  }
}
