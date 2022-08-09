import { cert, getApps, initializeApp } from 'firebase-admin/app';

if (!getApps().length) {
  initializeApp({
    credential: cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)
    ),
  });
}
