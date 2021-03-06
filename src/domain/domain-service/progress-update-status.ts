import { DSError, Failure, Result, Success } from 'src/__shared__/result';
import { Progress } from '../progress';
import { ProgressStatusVO, ProgressStatusType } from '../progress-status-vo';
import { IProgressRepository } from '../repository-interface/progress-repository-interface';

export class ProgressUpdateStatus {
  constructor(private readonly progressRepository: IProgressRepository) {
    this.progressRepository = progressRepository;
  }

  public execute = async (
    memberId: string,
    taskId: string,
    status: ProgressStatusVO
  ): Promise<Result<Progress, DSError>> => {
    let updateStatus: ProgressStatusVO;
    const tmpStatus = status.getStatus();

    if (tmpStatus === ProgressStatusType.notStarted) {
      updateStatus = new ProgressStatusVO(ProgressStatusType.awaitingReview);
    } else if (tmpStatus === ProgressStatusType.awaitingReview) {
      updateStatus = new ProgressStatusVO(ProgressStatusType.completed);
    } else {
      return new Failure(`progress stepup error.`);
    }

    const progress = await this.progressRepository.update(
      memberId,
      taskId,
      updateStatus.getStatus()
    );

    if (progress === null) {
      return new Failure('progress update failure.');
    }

    return new Success(progress);
  };
}
