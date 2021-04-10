import {LitElement, html, css} from 'lit-element';
import {customElement, query, internalProperty} from 'lit-element';
import {nothing} from 'lit-html';
import firebase from 'firebase/app';

import {sharedStyles} from './diy-styles';
import {firebaseApi} from '../modules/firebase-api'
import {firestoreApi} from '../modules/firestore-api'
import {UserDetails} from '../modules/state-types';
import {StateMixin, State} from '../mixins/state-mixin';
import {OxyInput} from '../oxygen/oxy-input';

import '../oxygen/oxy-button';
import '../oxygen/oxy-input';
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
    table th {
      text-align: left;
      padding-right: 8px;
    }
    .paper-card {
      margin-bottom: 16px;
    }

    .error {
      color: var(--error-text-color);
    }
  `];

  @query('#name-input') nameInput: OxyInput|undefined;
  @internalProperty() currentUser: firebase.User|null = null;
  @internalProperty() userDetails: UserDetails|null = null;
  @internalProperty() changeNameError = '';

  stateChanged(newState: State, _oldState: State|null) {
    this.currentUser = newState.firebaseUser;
    this.userDetails = newState.userDetails;
  }

  render() {
    return html`
      <div class="paper-card">
        ${this.renderGreeting()}
        ${this.renderAuthInfo()}
        <div class="buttons">
          <oxy-button @click=${this.onSignOut}>
            <oxy-icon icon="icons:exit-to-app"></oxy-icon>
            <div>Sign out</div>
          </oxy-button>
        </div>
      </div>

      ${this.renderChangeName()}
    `;
  }

  private renderGreeting() {
    const username = this.userDetails?.name;
    if (username) return html`<h2>Hello, ${username}!</h2>`;
    return html`<h2>Hello!</h2>`;
  }

  private renderAuthInfo() {
    const user = this.currentUser;
    if (!user) return nothing;
    return html`
      <p>
        The following information is private, but that's what we have on file
        about you.
      </p>
      <table>
        <tr>
          <th>Email</th>
          <td>${user.email} (${user.emailVerified ? '' : 'not '}verified)</td>
        </tr>
        <tr>
          <th>User ID</th>
          <td>${user.uid}</td>
        </tr>
      </table>
    `;
  }

  private renderChangeName() {
    const username = this.userDetails?.name;
    if (!username) return nothing;
    return html`
      <div class="paper-card">
        <h2>Change name</h2>
        <p>
          Your current display name is <b>${username}</b>. You can change your
          display name at any time.
        </p>
        <oxy-input id="name-input" placeholder="Enter new name"></oxy-input>
        <div class="error">${this.changeNameError}</div>

        <div class="buttons">
          <oxy-button @click=${this.onChangeName}>Change</oxy-button>
        </div>
      </div>
    `;
  }

  private onSignOut() {
    firebaseApi.getAuth().signOut();
    window.location.hash = "";
  }

  private onChangeName() {
    this.changeNameError = '';
    const currentName = this.userDetails?.name;
    const newName = this.nameInput?.value;
    if (!newName || !currentName) {
      this.changeNameError = 'Please enter a new name';
      return;
    }
    if (newName == currentName) {
      this.changeNameError = 'Current and new name cannot be the same';
      return;
    }
    const uid = this.currentUser?.uid;
    if (!uid) return;
    firestoreApi.changeUsername(uid, newName, currentName)
        .catch((error) => {
          this.changeNameError = error.message;
        });
  }
}
