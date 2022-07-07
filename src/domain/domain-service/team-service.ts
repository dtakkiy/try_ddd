import {
  DSError,
  Failure,
  NonError,
  Result,
  Success,
} from 'src/__shared__/result';
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
  public async changeTeamOfPair(
    pairId: string,
    teamId: string
  ): Promise<Result<Team, DSError>> {
    const currentTeam = await this.teamRepository.getByPairId(pairId);
    const newTeam = await this.teamRepository.getById(teamId);

    if (!currentTeam) {
      return new Failure('team does not exist.');
    }

    if (!newTeam) {
      return new Failure('team does not exist');
    }

    const pair = currentTeam.getPair(pairId);
    if (pair.isFailure()) {
      return new Failure(pair.err);
    }
    currentTeam.deletePair(pairId);
    newTeam.addPair(pair.value);

    this.teamRepository.update(currentTeam);
    this.teamRepository.update(newTeam);

    return new Success(newTeam);
  }

  // memberを指定したpairに変更する
  public async changePairOfMember(
    memberId: string,
    pairId: string
  ): Promise<Result<NonError, DSError>> {
    const currentTeam = await this.teamRepository.getByMemberId(memberId);
    const newTeam = await this.teamRepository.getByPairId(pairId);

    if (!currentTeam) {
      return new Failure('not exist.');
    }

    if (!newTeam) {
      return new Failure('not exist.');
    }

    currentTeam.deleteMember(memberId);
    const result = newTeam.addMember(memberId);
    if (result.isFailure()) {
      return new Failure(result.err);
    }

    this.teamRepository.update(newTeam);

    return new Success(null);
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
