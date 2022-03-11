import { ISomeDataQS } from './query-service-interface/some-data-qs';

export class GetSomeDataUseCase {
  private readonly someDataQS: ISomeDataQS;
  public constructor(someDataQS: ISomeDataQS) {
    this.someDataQS = someDataQS;
  }
  public async do() {
    try {
      return await this.someDataQS.getAll();
    } catch (error) {
      // memo: エラー処理
      throw error;
    }
  }
}
