import {collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc, DocumentSnapshot, Firestore, QuerySnapshot} from 'firebase/firestore';

import {firebaseApi} from './firebase-api';
import {FlavorVendor, Flavor} from './state-types';

type UnsubscribeFn = () => void;

class FirestoreApi {
  private db: Firestore;
  private userDocUnsubscribe: UnsubscribeFn|undefined;
  private usernameCache = new Map<string, Promise<string>>();

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
    if (!uid) return;

    this.userDocUnsubscribe = onSnapshot(doc(this.db, 'users', uid), callback);
  }

  changeUsername(uid: string, newName: string, oldName: string) {
    if (!uid) {
      return Promise.reject(new Error('User ID is invalid'));
    }
    if (oldName == newName) {
      return Promise.reject(new Error('New and old name are identical'));
    }

    // The first step is to add a username doc to the 'usernames' collection.
    // If insertion fails, the username is already taken. It may be taken by the
    // current user, so proceed either way. The second step is to update the doc
    // in the 'users' collection with the new name. The last step is to delete
    // the old username in case of a name change (print but otherwise ignore
    // failures).

    const newNameDoc = doc(this.db, 'usernames', newName);
    return setDoc(newNameDoc, {uid})
      .finally(() => {
        const userDoc = doc(this.db, 'users', uid);
        return setDoc(userDoc, {name: newName})
          .then(() => {
            if (!oldName) return Promise.resolve();
            const oldNameDoc = doc(this.db, 'usernames', oldName);
            return deleteDoc(oldNameDoc).catch((error) => {
              console.warn('Error deleting old username doc', error);
            });
          })
          .catch(() => {
            throw new Error('The name is already taken');
          });
      });
  }

  usernameForUid(uid: string): Promise<string> {
    // Check if the username is already cached.
    const entry = this.usernameCache.get(uid);
    if (entry) return entry;

    // Otherwise, request the username from Firestore.
    const promise = getDoc(doc(this.db, 'users', uid))
        .then((doc) => doc.data()?.name || '')
        .catch((error: Error) => {
          console.log('Error fetching user name:', error.message);
          return '';
        });
    this.usernameCache.set(uid, promise);
    return promise;
  }

  getFlavorVendors(): Promise<FlavorVendor[]> {
    return getDocs(collection(this.db, 'vendors'))
      .then((snapshot: QuerySnapshot) => {
        const vendors: FlavorVendor[] = [];
        snapshot.docs.forEach((doc) => {
          const vendor: FlavorVendor = {
            id: doc.id,
            name: doc.get('name') ?? '',
            short: doc.get('short') ?? '',
            website: doc.get('website') ?? '',
            description: doc.get('description') ?? '',
          };
          vendors.push(vendor);
        });
        return vendors;
      });
  }

  getFlavors(): Promise<Flavor[]> {
    return getDocs(collection(this.db, 'flavors'))
      .then((snapshot: QuerySnapshot) => {
        const flavors: Flavor[] = [];
        snapshot.docs.forEach((doc) => {
          const flavor: Flavor = {
            id: doc.id,
            name: doc.get('name') ?? '',
            vendor: doc.get('vendor') ?? '',
          };
          flavors.push(flavor);
        });
        return flavors;
      });
  }
}

export const firestoreApi = new FirestoreApi();
