import { getAuth } from 'firebase-admin/auth';
import { UserRole, UserSession } from 'src/app/session-interface/user-session';

export interface UserSessionProvider {
  getUserSession(): UserSession;
}

interface FirebaseUserAttribute {
  uid: string;
  email: string | undefined;
  phone_number?: string;
  picture?: any;
}

export class FirebaseSecuritySessionProvider implements UserSessionProvider {
  private readonly token: string;
  private readonly firebaseUserAttribute: FirebaseUserAttribute = {
    uid: '',
    email: '',
  };

  private constructor(token: string) {
    this.isVerifyIdToken(token);
    this.firebaseUserAttribute = this.getUserAttributes(token);
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
    // ここではFirebaseの仕組みから認証情報を取得し詰め替えて返すことを想定
    return {
      uid: this.firebaseUserAttribute.uid,
      email: this.firebaseUserAttribute.email,
      phone_number: this.firebaseUserAttribute.phone_number,
      picture: this.firebaseUserAttribute.picture,
      userRole: UserRole.ADMIN, //ダミー値
    };
  }

  private async getUserAttributes(
    idToken: string
  ): Promise<FirebaseUserAttribute> {
    const userSession: FirebaseUserAttribute = { uid: '', email: '' };

    try {
      const decodeToken = await getAuth().verifyIdToken(idToken);
      userSession.uid = decodeToken?.uid;
      userSession.email = decodeToken?.email;
      userSession.phone_number = decodeToken.phone_number;
      userSession.picture = decodeToken.picture;
    } catch (e) {
      console.log(e);
    }

    return userSession;
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
