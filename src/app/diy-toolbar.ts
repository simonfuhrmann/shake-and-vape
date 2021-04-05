import {LitElement, html, css} from 'lit-element';
import {customElement, internalProperty} from 'lit-element';
import {nothing} from 'lit-html';
import firebase from 'firebase/app';

import {sharedStyles} from './diy-styles';
import {firebaseApi} from '../modules/firebase-api'
import {StateMixin, State} from '../mixins/state-mixin';

import '../components/diy-router-link';
import '../oxygen/oxy-button';
import '../oxygen/oxy-icon';
import '../oxygen/oxy-icons-all';

@customElement('diy-toolbar')
export class DiyToolbar extends StateMixin(LitElement) {
  static styles = [
    sharedStyles, css`
    :host {
      background-color: #424b4b;
      color: #fff;
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
    oxy-button#menu {
      border-radius: 20px;
    }
    oxy-button#signin {
      padding: 8px 16px;
    }
    oxy-button#signin oxy-icon {
      margin-right: 4px;
    }
  `];

  @internalProperty() currentUser: firebase.User|null = null;

  stateChanged(newState: State, _oldState: State|null) {
    this.currentUser = newState.firebaseUser;
  }

  render() {
    return html`
      <diy-router-link path="">
        <oxy-button id="menu">
          <oxy-icon icon="icons:menu"></oxy-icon>
        </oxy-button>
      </diy-router-link>

      <h1>Shake and Vape</h1>

      ${this.renderSigninButton()}
      ${this.renderSignoutButton()}
    `;
  }

  private renderSigninButton() {
    if (this.currentUser !== null) return nothing;
    return html`
      <diy-router-link path="/user/auth">
        <oxy-button id="signin">
          <oxy-icon icon="social:person"></oxy-icon>
          <div>Sign in</div>
        </oxy-button>
      </diy-router-link>
    `;
  }

  private renderSignoutButton() {
    if (this.currentUser === null) return nothing;
    return html`
      <diy-router-link path="">
        <oxy-button id="signin" @click=${this.signOut}>
          <oxy-icon icon="social:person"></oxy-icon>
          <div>Sign out</div>
        </oxy-button>
      </diy-router-link>
    `;
  }

  private signOut() {
    firebaseApi.getAuth().signOut();
  }
}
