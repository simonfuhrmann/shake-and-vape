import {LitElement, css, html, nothing} from 'lit';
import {customElement, state} from 'lit/decorators';
import firebase from 'firebase/app';

import 'oxygen-mdc/oxy-button';
import 'oxygen-mdc/oxy-icon';
import 'oxygen-mdc/oxy-icons-all';

import {sharedStyles} from './diy-styles';
import {UserDetails} from '../modules/state-types';
import {StateController, State} from '../controllers/state-controller';

import '../components/diy-router-link';

@customElement('diy-toolbar')
export class DiyToolbar extends LitElement {
  static styles = [
    sharedStyles, css`
    :host {
      background-color: var(--bg-color-toolbar);
      color: var(--fg-color-toolbar);
      padding: 0 16px;
      height: 64px;
      display: flex;
      flex-direction: row;
      align-items: center;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
    }
    h1 {
      margin-left: 8px;
      font-size: 20px;
      font-weight: normal;
      flex-grow: 1;
    }
    #menu-button {
      border-radius: 20px;
    }
    #signin-button, #user-button {
      padding: 8px 16px;
    }
  `];

  @state() private currentUser: firebase.User|null = null;
  @state() private userDetails: UserDetails|null = null;

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
      <diy-router-link path="">
        <oxy-button id="menu-button">
          <oxy-icon icon="icons:menu"></oxy-icon>
        </oxy-button>
      </diy-router-link>

      <h1>Shake and Vape</h1>

      ${this.renderSigninButton()}
      ${this.renderUserMenu()}
    `;
  }

  private renderSigninButton() {
    if (this.currentUser !== null) return nothing;
    return html`
      <diy-router-link path="/user/auth">
        <oxy-button id="signin-button">
          <oxy-icon icon="social:person"></oxy-icon>
          <div>Sign in</div>
        </oxy-button>
      </diy-router-link>
    `;
  }

  private renderUserMenu() {
    if (this.currentUser === null) return nothing;
    return html`
      <diy-router-link path="/user/profile">
        <oxy-button id="user-button">
          <oxy-icon icon="social:person"></oxy-icon>
          <div>${this.userDetails?.name || 'Sign in'}</div>
        </oxy-button>
      </diy-router-link>
    `;
  }
}
