export const ProgressStatusType = {
  notStarted: '未着手',
  awaitingReview: 'レビュー待ち',
  completed: '完了',
};

interface IProgressStatus {
  status: string;
}

export class ProgressStatus {
  private props: IProgressStatus;

  constructor(props: IProgressStatus) {
    this.validateStatus(props.status);
    this.props = props;
  }

  private validateStatus(status: string) {
    if (Object.values(ProgressStatusType).includes(status) === false) {
      throw new Error(`not applicable progress status value. ${status}`);
    }
  }

  public get status() {
    return this.props.status;
  }

  public static create(props: IProgressStatus) {
    return new ProgressStatus({
      status: props.status ?? ProgressStatusType.notStarted,
    });
  }

  public isComplete(): boolean {
    return this.props.status === ProgressStatusType.completed;
  }

  public stepUp(): ProgressStatus {
    if (this.props.status === ProgressStatusType.notStarted) {
      return new ProgressStatus({ status: ProgressStatusType.awaitingReview });
    }

    if (this.props.status === ProgressStatusType.awaitingReview) {
      return new ProgressStatus({ status: ProgressStatusType.completed });
    }

    throw new Error(`progress stepup error.`);
  }
}
