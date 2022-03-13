import { IMemberQueryService } from './query-service-interface/member-query-service';

export class GetMemberListUseCase {
  private readonly queryService: IMemberQueryService;

  constructor(queryService: IMemberQueryService) {
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
