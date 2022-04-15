import { IProgressRepository } from '../repository-interface/progress-repository-interface';
import { ProgressStatusVO, ProgressStatusType } from '../progress-status-vo';

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
    let updateStatus: ProgressStatusVO;
    const tmpStatus = status.getStatus();

    if (tmpStatus === ProgressStatusType.notStarted) {
      updateStatus = new ProgressStatusVO(ProgressStatusType.awaitingReview);
    } else if (tmpStatus === ProgressStatusType.awaitingReview) {
      updateStatus = new ProgressStatusVO(ProgressStatusType.completed);
    } else {
      throw new Error(`progress stepup error.`);
    }

    await this.progressRepository.update(
      memberId,
      taskId,
      updateStatus.getStatus()
    );
  };
}
