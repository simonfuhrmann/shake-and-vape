import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import {firebaseConfig} from '../config/firebase';

class FirebaseApi {
  private app: firebase.app.App;

  constructor() {
    this.app = firebase.initializeApp(firebaseConfig);
  }

  getAuth(): firebase.auth.Auth {
    return this.app.auth();
  }

  getFirestore(): firebase.firestore.Firestore {
    return this.app.firestore();
  }
}

export const firebaseApi = new FirebaseApi();
