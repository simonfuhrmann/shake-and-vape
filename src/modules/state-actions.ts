import firebase from 'firebase/app';

import {State, UserDetails, stateManager, getInitialState} from './state-types';

// Sets the current Firebase user.
export function setCurrentUser(firebaseUser: firebase.User|null) {
  const action = (state: State) => {
    if (state.firebaseUser === firebaseUser) return state;
    return {...state, firebaseUser};
  };
  stateManager.processAction(action);
}

export function setUserDetails(userDetails: UserDetails|null) {
  const action = (state: State) => {
    if (state.userDetails === userDetails) return state;
    return {...state, userDetails};
  };
  stateManager.processAction(action);
}

// Resets the application's global state.
export function resetState() {
  const action = () => getInitialState();
  stateManager.processAction(action);
}
