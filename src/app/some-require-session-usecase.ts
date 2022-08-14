import { UserSession } from './session-interface/user-session';

// セッションを利用したユースケースの実装例
export class SomeRequireSessionUseCase {
  public execute(userSession: UserSession) {
    if (userSession) {
      // セッションを利用した処理を記述
    }
  }
}
