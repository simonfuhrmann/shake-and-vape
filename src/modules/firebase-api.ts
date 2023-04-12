import {FirebaseApp, initializeApp} from 'firebase/app';
import {Firestore, getFirestore} from 'firebase/firestore';
import {Auth, getAuth} from 'firebase/auth';

import 'firebase/auth';
import 'firebase/firestore';

import {firebaseConfig} from '../config/firebase';

class FirebaseApi {
  private app: FirebaseApp;

  constructor() {
    this.app = initializeApp(firebaseConfig);
  }

  getAuth(): Auth {
    return getAuth(this.app);
  }

  getFirestore(): Firestore {
    return getFirestore(this.app);
  }
}

export const firebaseApi = new FirebaseApi();
