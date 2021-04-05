import firebase from 'firebase/app';
import 'firebase/firestore';

import {firebaseApi} from './firebase-api';

export type DocumentSnapshot = firebase.firestore.DocumentSnapshot<
    firebase.firestore.DocumentData>;

type UnsubscribeFn = () => void;

class FirestoreApi {
  private db: firebase.firestore.Firestore;
  private userDocUnsubscribe: UnsubscribeFn|undefined;

  constructor() {
    this.db = firebaseApi.getFirestore();
  }

  onUserDocSnapshot(
      uid: string, callback: (snapshot: DocumentSnapshot) => void) {
    // Unsubscribe previous user doc change listeners.
    if (this.userDocUnsubscribe) {
      this.userDocUnsubscribe();
      this.userDocUnsubscribe = undefined;
    }

    const ref = this.db.collection('users').doc(uid);
    this.userDocUnsubscribe = ref.onSnapshot(callback);
  }

  changeUsername(uid: string, newName: string, oldName: string) {
    if (!uid) {
      return Promise.reject(new Error('User ID is invalid'));
    }
    if (oldName == newName) {
      return Promise.reject(new Error('New and old name are identical'));
    }

    // The first step is to add a username doc to the 'usernames' collection.
    // If insertion fails, the username is already taken. The second step is to
    // update the doc in the 'users' collection with the new name. The last step
    // is to delete the old username in case of a name change (print but
    // otherwise ignore failures).
    const newNameDoc = this.db.collection('usernames').doc(newName);
    return newNameDoc.set({ uid })
      .then(() => {
        const userDoc = this.db.collection('users').doc(uid);
        return userDoc.set({ name: newName })
          .then(() => {
            if (!oldName) return Promise.resolve();
            const oldNameDoc = this.db.collection('usernames').doc(oldName);
            return oldNameDoc.delete().catch((error) => {
              console.warn('Error deleting old username doc', error);
            });
          })
          .catch(() => {
            throw new Error('The name is already taken');
          });
      })
      .catch(() => {
        throw new Error('The name is already taken');
      });
  }
}

export const firestoreApi = new FirestoreApi();
