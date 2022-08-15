import { getAuth } from 'firebase-admin/auth';
import { UserRole, UserSession } from 'src/app/session-interface/user-session';

export interface UserSessionProvider {
  getUserSession(): UserSession;
}

interface FirebaseUserSession {
  uid: string;
  email: string | undefined;
  phone_number?: string;
  picture?: any;
}

export class FirebaseSecuritySessionProvider implements UserSessionProvider {
  private readonly token: string;
  private readonly firebaseUserSession: FirebaseUserSession = {
    uid: '',
    email: '',
  };

  private constructor(token: string) {
    this.isVerifyIdToken(token);
    this.getFirebaseUserSessionByToken(token);
    this.token = token;
  }

  public static create(token: string) {
    try {
      return new FirebaseSecuritySessionProvider(token);
    } catch (e) {
      return null;
    }
  }

  public getUserSession(): UserSession {
    return {
      uid: this.firebaseUserSession.uid,
      email: this.firebaseUserSession.email,
      phone_number: this.firebaseUserSession.phone_number,
      picture: this.firebaseUserSession.picture,
      userRole: UserRole.ADMIN, //ダミー値
    };
  }

  private async getFirebaseUserSessionByToken(idToken: string): Promise<void> {
    try {
      const decodeToken = await getAuth().verifyIdToken(idToken);
      this.firebaseUserSession.uid = decodeToken?.uid;
      this.firebaseUserSession.email = decodeToken?.email;
      this.firebaseUserSession.phone_number = decodeToken?.phone_number;
      this.firebaseUserSession.picture = decodeToken?.picture;
    } catch (e) {
      console.log(e);
    }
  }

  private async isVerifyIdToken(idToken: string): Promise<boolean> {
    try {
      await getAuth().verifyIdToken(idToken);
    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  }
}
