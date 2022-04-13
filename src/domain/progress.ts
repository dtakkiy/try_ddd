import { ProgressStatusVO } from './progress-status-vo';

interface IProgress {
  memberId: string;
  taskId: string;
  status: ProgressStatusVO;
}

export class Progress {
  private props: IProgress;
  constructor(props: IProgress) {
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

  public get memberId() {
    return this.props.memberId;
  }

  public get taskId() {
    return this.props.taskId;
  }

  public get status() {
    return this.props.status.getStatus();
  }

  public equals = (progress: Progress): boolean => {
    return (
      progress.props.memberId === this.props.memberId &&
      progress.props.taskId === this.props.taskId
    );
  };

  public changeStatusForward = (memberId: string): Progress => {
    if (memberId !== this.props.memberId) {
      throw new Error('only the owner can change the task status.');
    }

    if (this.props.status.isComplete()) {
      throw new Error(`already completed.`);
    }

    this.props.status = this.props.status.stepUp();
    return this;
  };
}
