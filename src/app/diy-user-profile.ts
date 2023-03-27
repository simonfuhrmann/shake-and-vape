import {LitElement, css, html, nothing} from 'lit';
import {customElement, query, state} from 'lit/decorators';
import firebase from 'firebase/app';

import {OxyInput} from 'oxygen-mdc/oxy-input';
import 'oxygen-mdc/oxy-button';
import 'oxygen-mdc/oxy-input';
import 'oxygen-mdc/oxy-icon';
import 'oxygen-mdc/oxy-icons-all';

import {firebaseApi} from '../modules/firebase-api'
import {firestoreApi} from '../modules/firestore-api'
import {sharedStyles} from './diy-styles';
import {StateController, State} from '../controllers/state-controller';
import {UserDetails} from '../modules/state-types';

@customElement('diy-user-profile')
export class DiyUserProfile extends LitElement {
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
      color: var(--fg-color-error);
    }
  `];

  @query('#name-input') nameInput: OxyInput|undefined;
  @state() private currentUser: firebase.User|null = null;
  @state() private userDetails: UserDetails|null = null;
  @state() private changeNameError = '';

  constructor() {
    super();
    new StateController(this);
  }

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
      this.changeNameError = 'New and current name cannot be the same';
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
