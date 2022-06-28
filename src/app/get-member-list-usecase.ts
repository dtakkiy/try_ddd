import { IMemberQueryService } from './query-service-interface/member-query-service';

export class GetMemberListUseCase {
  constructor(private readonly memberQueryService: IMemberQueryService) {
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
