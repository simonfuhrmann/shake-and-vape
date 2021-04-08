import {LitElement, html, css} from 'lit-element';
import {customElement, internalProperty} from 'lit-element';
import firebase from 'firebase/app';

import {sharedStyles} from './diy-styles';
import {firebaseApi} from '../modules/firebase-api'
import {UserDetails} from '../modules/state-types';
import {StateMixin, State} from '../mixins/state-mixin';

import '../oxygen/oxy-button';
import '../oxygen/oxy-icon';
import '../oxygen/oxy-icons-all';

@customElement('diy-user-profile')
export class DiyUserProfile extends StateMixin(LitElement) {
  static styles = [
    sharedStyles, css`
    :host {
      max-width: var(--default-content-width);
      margin: 0 auto;
      padding: 32px;
      display: flex;
      flex-direction: column;
    }
  `];

  @internalProperty() currentUser: firebase.User|null = null;
  @internalProperty() userDetails: UserDetails|null = null;

  stateChanged(newState: State, _oldState: State|null) {
    this.currentUser = newState.firebaseUser;
    this.userDetails = newState.userDetails;
  }

  render() {
    return html`
      <div class="paper-card">
        <h2>Hello, ${this.userDetails?.name || 'unknown'}</h2>
        <div class="buttons">
          <oxy-button @click=${this.signOut}>
            <oxy-icon icon="icons:exit-to-app"></oxy-icon>
            <div>Sign out</div>
          </oxy-button>
        </div>
      </div>
    `;
  }

  private signOut() {
    firebaseApi.getAuth().signOut();
    window.location.hash = "";
  }
}
