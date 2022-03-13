import { ProgressStatus } from './progress-status';

interface IProgress {
  memberId: string;
  taskId: string;
  status: ProgressStatus;
}

export class Progress {
  private props: IProgress;
  constructor(props: IProgress) {
    this.props = props;
  }

  public get memberId() {
    return this.props.memberId;
  }

  public get taskId() {
    return this.props.taskId;
  }

  public get status() {
    return this.props.status.status;
  }

  public equals = (progress: Progress): boolean => {
    return (
      progress.props.memberId === this.props.memberId &&
      progress.props.taskId === this.props.taskId
    );
  };

  public changeStatusForward = (): Progress => {
    if (this.props.status.isComplete()) {
      throw new Error();
    }

    this.props.status = this.props.status.stepUp();
    return this;
  };

  public static create(props: IProgress): Progress {
    return new Progress(props);
  }
}
