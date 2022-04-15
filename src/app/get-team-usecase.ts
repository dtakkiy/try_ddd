import { ITeamQueryService } from './query-service-interface/team-query-service';

export class GetTeamUseCase {
  private readonly teamQueryService: ITeamQueryService;

  constructor(teamQueryService: ITeamQueryService) {
    this.teamQueryService = teamQueryService;
  }

  public async execute() {
    try {
      return await this.teamQueryService.getAll();
    } catch (error) {
      throw error;
    }
  }
}
