import firebase from 'firebase/app';

import {State, stateManager, getInitialState} from './state-types';

// Sets the current Firebase user.
export function setCurrentUser(firebaseUser: firebase.User|null) {
  const action = (state: State) => {
    if (state.firebaseUser === firebaseUser) return state;
    return {...state, firebaseUser};
  };
  stateManager.processAction(action);
}

// Resets the application's global state.
export function resetState() {
  const action = () => getInitialState();
  stateManager.processAction(action);
}
