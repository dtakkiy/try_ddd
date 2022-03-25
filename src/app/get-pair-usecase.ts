import { IPairQueryService } from './query-service-interface/pair-query-service';

export class GetPairUseCase {
  private readonly queryService: IPairQueryService;

  constructor(queryService: IPairQueryService) {
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
