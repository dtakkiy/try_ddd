import { DSError, Failure, Result, Success } from 'src/__shared__/result';
import { ProgressStatusVO, ProgressStatusType } from './progress-status-vo';

interface IProgress {
  memberId: string;
  taskId: string;
  status: ProgressStatusVO;
}

export class Progress {
  constructor(private readonly props: IProgress) {
    const { memberId, taskId, status } = props;
    this.props = {
      memberId: memberId,
      taskId: taskId,
      status: status,
    };
  }

  public getAllProperties() {
    return {
      memberId: this.props.memberId,
      taskId: this.props.taskId,
      status: this.props.status.getStatus(),
    };
  }

  public getStatus() {
    return this.props.status.getStatus();
  }

  public isSameProgress = (progress: Progress): boolean => {
    return (
      progress.props.memberId === this.props.memberId &&
      progress.props.taskId === this.props.taskId
    );
  };

  public changeStatusForward = (
    memberId: string
  ): Result<Progress, DSError> => {
    if (memberId !== this.props.memberId) {
      return new Failure('only the owner can change the task status.');
    }

    if (this.props.status.isComplete()) {
      return new Failure(`already completed.`);
    }

    let updateStatus: ProgressStatusVO;
    const tmpStatus = this.props.status.getStatus();

    if (tmpStatus === ProgressStatusType.notStarted) {
      updateStatus = new ProgressStatusVO(ProgressStatusType.awaitingReview);
    } else if (tmpStatus === ProgressStatusType.awaitingReview) {
      updateStatus = new ProgressStatusVO(ProgressStatusType.completed);
    } else {
      return new Failure(`progress stepup error.`);
    }

    this.props.status = updateStatus;
    return new Success(this);
  };
}
