import firebase from 'firebase/app';

import {StateManager} from './state-manager';

export interface UserDetails {
  name: string;
}

export interface State {
  firebaseUser: firebase.User|null;
  userDetails: UserDetails|null;
}

export function getInitialState(): State {
  return {
    firebaseUser: null,
    userDetails: null,
  };
}

export const stateManager = new StateManager(getInitialState());
