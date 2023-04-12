import {LitElement, css, html, nothing} from 'lit';
import {customElement, query, state} from 'lit/decorators';
import {DocumentSnapshot} from 'firebase/firestore';
import {User as FirebaseUser} from 'firebase/auth';

import {OxyInput} from 'oxygen-mdc/oxy-input';
import 'oxygen-mdc/oxy-button';
import 'oxygen-mdc/oxy-input';
import 'oxygen-mdc/oxy-dialog';

import {StateController} from '../controllers/state-controller';
import {State, UserDetails} from '../modules/state-types';
import {firebaseApi} from '../modules/firebase-api'
import {firestoreApi} from '../modules/firestore-api'
import {sharedStyles} from './diy-styles';
import * as Actions from '../modules/state-actions';

@customElement('diy-auth-state')
export class DiyAuthState extends LitElement {
  static styles = [
    sharedStyles, css`
      #user-name-error {
        padding-top: 8px;
        color: var(--fg-color-error);
        font-size: 0.9em;
      }
    `];

  private currentUser: FirebaseUser|null = null;

  @query('#user-name-input') userNameInput: OxyInput|undefined;
  @state() private userDetails: UserDetails|null = null;
  @state() private userNameError: string = '';

  constructor() {
    super();
    new StateController(this);
  }

  connectedCallback() {
    super.connectedCallback();

    // Publish the current user to the global state every time it changes.
    firebaseApi.getAuth().onAuthStateChanged((user: FirebaseUser|null) => {
      Actions.setCurrentUser(user);
      this.loadUserDetails(user);
    });

    // Focus the user name input.
    setTimeout(() => { this.userNameInput?.focus(); }, 0);
  }

  stateChanged(newState: State) {
    this.currentUser = newState.firebaseUser;
    this.userDetails = newState.userDetails;
  }

  render() {
    if (!this.userDetails || this.userDetails.name !== '') return nothing;
    return html`
      ${this.renderDisplayNameDialog()}
    `;
  }

  private renderDisplayNameDialog() {
    return html`
      <oxy-dialog heading="Enter your display name" noescape backdrop opened>
        <div class="content">
          <p>
            Shake and Vape takes your privacy serious. As such, your email
            address and real name that may be associated with your sign-in
            credientials are never displayed to other users. You choose the name
            other users will see.
          </p>
          <oxy-input id="user-name-input" placeholder="Enter name"></oxy-input>
          <div id="user-name-error">${this.userNameError}</div>
        </div>
        <div slot="buttons">
          <oxy-button @click=${this.onSetUserName}>Set name</oxy-button>
        </div>
      </oxy-dialog>
    `;
  }

  private loadUserDetails(user: FirebaseUser|null) {
    if (!user || !user.uid) {
      Actions.setUserDetails(null);
      firestoreApi.onUserDocSnapshot('', () => {});
      return;
    }

    // Install a change listener for the user's document.
    firestoreApi.onUserDocSnapshot(
        user.uid, this.onUserDocChanged.bind(this));
  }

  private onUserDocChanged(snapshot: DocumentSnapshot) {
    const userDetails = { name: '' };
    const data = snapshot.data();
    if (data) {
      userDetails.name = data.name;
    }
    Actions.setUserDetails(userDetails);
  }

  private onSetUserName() {
    const input = this.userNameInput;
    if (!input) return;
    const newName = input.value;

    this.userNameError = '';
    if (newName.length < 3) {
      this.userNameError = 'The name must have 3 or more characters';
      return;
    }
    if (newName.length > 30) {
      this.userNameError = 'The name must have 30 or fewer characters';
      return;
    }

    if (!this.currentUser) return;
    const uid = this.currentUser.uid;
    const oldName = '';
    firestoreApi.changeUsername(uid, newName, oldName)
        .catch((error) => {
          this.userNameError = error.message;
        });
  }
}
