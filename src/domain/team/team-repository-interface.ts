import { Team } from './team';

export interface ITeamRepository {
  getAll(): Promise<Team[] | null>;
  getById(id: string): Promise<Team | null>;
}
