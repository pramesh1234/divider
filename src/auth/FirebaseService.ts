import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import * as serviceAccount from '../../src/broadcastkaro_firebase.json';  // Use correct path

@Injectable()
export class FirebaseService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      databaseURL: 'https://broadcastkaro-default-rtdb.asia-southeast1.firebasedatabase.app',
    });
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    return admin.auth().verifyIdToken(idToken);
  }
  async sendOtp(phoneNumber: string): Promise<string> {
    const verificationId = await admin.auth().createCustomToken(phoneNumber);
    return verificationId;
  }
}
