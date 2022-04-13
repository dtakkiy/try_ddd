import { Team } from '../team';

export interface ITeamRepository {
  getAll(): Promise<Team[] | null>;
  getById(teamId: string): Promise<Team | null>;
  update(team: Team): Promise<Team>;
  getByPairId(pairId: string): Promise<Team | null>;
  getByMemberId(memberId: string): Promise<Team | null>;
}
