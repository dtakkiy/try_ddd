import { UserRole, UserSession } from 'src/app/session-interface/user-session';

export interface UserSessionProvider {
  getUserSession(): UserSession;
}

export class FirebaseSecuritySessionProvider implements UserSessionProvider {
  public getUserSession(): UserSession {
    // ここではFirebaseの仕組みから認証情報を取得し詰め替えて返すことを想定
    return {
      userId: '1', //ダミー値
      userRole: UserRole.ADMIN, //ダミー値
    };
  }
}
