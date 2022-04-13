import { IProgressRepository } from '../repository-interface/progress-repository-interface';
import { ProgressStatusVO } from '../progress-status-vo';

export class ProgressUpdateStatus {
  private readonly progressRepository: IProgressRepository;

  constructor(progressRepository: IProgressRepository) {
    this.progressRepository = progressRepository;
  }

  public execute = async (
    memberId: string,
    taskId: string,
    status: ProgressStatusVO
  ): Promise<void> => {
    status.stepUp();

    await this.progressRepository.update(memberId, taskId, status.getStatus());
  };
}
