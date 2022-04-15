import { IPairQueryService } from './query-service-interface/pair-query-service';

export class GetPairUseCase {
  private readonly memberQueryService: IPairQueryService;

  constructor(memberQueryService: IPairQueryService) {
    this.memberQueryService = memberQueryService;
  }

  public async execute() {
    try {
      return await this.memberQueryService.getAll();
    } catch (error) {
      throw error;
    }
  }
}
