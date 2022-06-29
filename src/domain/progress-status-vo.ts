// 課題進捗は、「未着手」「レビュー待ち」「完了」の3種類
export const ProgressStatusType = {
  notStarted: '未着手',
  awaitingReview: 'レビュー待ち',
  completed: '完了',
};

export const validateSearchProgressStatus = (status: string) => {
  if (Object.values(ProgressStatusType).includes(status) === false) {
    return `not applicable progress status value. ${status}`;
  }
};

export const validateProgressStatus = (status: string) => {
  if (Object.values(ProgressStatusType).includes(status) === false) {
    throw new Error(`not applicable progress status value. ${status}`);
  }
};
export class ProgressStatusVO {
  private readonly _value: string;
  constructor(status: string) {
    this.validateStatus(status);
    this._value = status;
  }

  private validateStatus(status: string) {
    if (Object.values(ProgressStatusType).includes(status) === false) {
      throw new Error(`not applicable progress status value. ${status}`);
    }
  }

  public getStatus() {
    return this._value;
  }

  public static create() {
    return new ProgressStatusVO(ProgressStatusType.notStarted);
  }

  public isComplete(): boolean {
    return this._value === ProgressStatusType.completed;
  }

  public isEquals = (progress: ProgressStatusVO): boolean => {
    return this._value === progress.getStatus();
  };
}
