import { ITeamQueryService } from './query-service-interface/team-query-service';

export class GetTeamUseCase {
  constructor(private readonly teamQueryService: ITeamQueryService) {
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
