import firebase from 'firebase/app';

import {StateManager} from './state-manager';

export interface State {
  firebaseUser: firebase.User|null;
}

export function getInitialState(): State {
  return {
    firebaseUser: null,
  };
}

export const stateManager = new StateManager(getInitialState());
