import {LitElement, customElement} from 'lit-element';
import {nothing} from 'lit-html';
import firebase from 'firebase/app';

import {firebaseApi} from '../modules/firebase'
import * as Actions from '../modules/state-actions';

@customElement('diy-auth-state')
export class DiyAuthState extends LitElement {
  connectedCallback() {
    super.connectedCallback();

    // Publish the current user to the global state every time it changes.
    firebaseApi.getAuth().onAuthStateChanged((user: firebase.User|null) => {
      Actions.setCurrentUser(user);
    });
  }

  render() {
    return nothing;
  }
}
