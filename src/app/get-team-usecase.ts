import { ITeamQueryService } from './query-service-interface/team-query-service';

export class GetTeamUseCase {
  private readonly queryService: ITeamQueryService;

  constructor(queryService: ITeamQueryService) {
    this.queryService = queryService;
  }

  public async execute() {
    try {
      return await this.queryService.getAll();
    } catch (error) {
      throw error;
    }
  }
}
