import { IProgressRepository } from '../repository-interface/progress-repository-interface';
import { ProgressStatus } from '../progress-status-vo';

export class ProgressUpdateStatus {
  private readonly progressRepository: IProgressRepository;

  constructor(progressRepository: IProgressRepository) {
    this.progressRepository = progressRepository;
  }

  public execute = async (
    memberId: string,
    taskId: string,
    status: ProgressStatus
  ): Promise<void> => {
    status.stepUp();

    await this.progressRepository.update(memberId, taskId, status.getStatus());
  };
}
