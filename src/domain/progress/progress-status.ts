export const ProgressStatusType = {
  notStarted: '未着手',
  awaitingReview: 'レビュー待ち',
  completed: '完了',
};
export class ProgressStatus {
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
    return new ProgressStatus(ProgressStatusType.notStarted);
  }

  public isComplete(): boolean {
    return this._value === ProgressStatusType.completed;
  }

  public stepUp(): ProgressStatus {
    if (this._value === ProgressStatusType.notStarted) {
      return new ProgressStatus(ProgressStatusType.awaitingReview);
    }

    if (this._value === ProgressStatusType.awaitingReview) {
      return new ProgressStatus(ProgressStatusType.completed);
    }

    throw new Error(`progress stepup error.`);
  }

  public equals = (progress: ProgressStatus): boolean => {
    return this._value === progress.getStatus();
  };
}
