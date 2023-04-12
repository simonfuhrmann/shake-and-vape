import {LitElement, css, html, nothing} from 'lit';
import {customElement, state} from 'lit/decorators';
import {User as FirebaseUser} from 'firebase/auth';

import 'oxygen-mdc/oxy-button';
import 'oxygen-mdc/oxy-icon';
import 'oxygen-mdc/oxy-icons-all';

import {sharedStyles} from './diy-styles';
import {UserDetails} from '../modules/state-types';
import {StateController, State} from '../controllers/state-controller';

import './diy-menu-box';
import '../components/diy-router-link';

@customElement('diy-toolbar')
export class DiyToolbar extends LitElement {
  static styles = [
    sharedStyles, css`
    #toolbar {
      background-color: var(--diy-toolbar-bg-color);
      color: var(--diy-toolbar-fg-color);
      height: var(--diy-toolbar-height);
      padding: 0 16px;

      position: relative;  /* For z-index to work. */
      z-index: 3;          /* Be above the menu. */

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
    #signin-button, #user-button {
      padding: 8px 16px;
    }

    /* Show menu button if screen is small. */
    @media screen and (max-width: 690px) {
      #home-button { display: none; }
    }
    /* Show home button if screen is big. */
    @media screen and (min-width: 691px) {
      #menu-button { display: none; }
      diy-menu-box { display: none; }
    }
  `];

  @state() private currentUser: FirebaseUser|null = null;
  @state() private userDetails: UserDetails|null = null;
  @state() private showMenu = false;

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
      <div id="toolbar">
        <diy-router-link path="">
          <oxy-button id="home-button">
            <oxy-icon icon="icons:home"></oxy-icon>
          </oxy-button>
        </diy-router-link>

        <oxy-button
            id="menu-button"
            @click=${() => this.showMenu = !this.showMenu}>
          <oxy-icon icon="icons:menu"></oxy-icon>
        </oxy-button>

        <h1>Shake and Vape</h1>

        ${this.renderSigninButton()}
        ${this.renderProfileButton()}
      </div>

      <diy-menu-box
          ?opened=${this.showMenu}
          @closed=${() => this.showMenu = false}>
      </diy-menu-box>
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

  private renderProfileButton() {
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
