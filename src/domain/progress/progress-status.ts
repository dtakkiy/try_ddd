type ProgressStatusType = '未着手' | 'レビュー待ち' | '完了';

interface IProgressStatus {
  status: string;
}

export class ProgressStatus {
  private props: IProgressStatus;
  constructor(props: IProgressStatus) {
    this.props = props;
  }

  public get status() {
    return this.props.status;
  }

  public static create(props: IProgressStatus) {
    return new ProgressStatus({ status: props.status ?? '未着手' });
  }

  public isComplete(): boolean {
    return this.props.status === '完了';
  }

  public stepUp(): ProgressStatus {
    if (this.props.status === '未着手') {
      return new ProgressStatus({ status: 'レビュー待ち' });
    }

    if (this.props.status === 'レビュー待ち') {
      return new ProgressStatus({ status: '完了' });
    }

    throw new Error();
  }
}
