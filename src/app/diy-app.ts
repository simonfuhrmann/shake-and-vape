import {LitElement, html, css} from 'lit-element';
import {customElement} from 'lit-element';

import {sharedStyles} from './diy-styles';

import '../components/diy-router-view';
import '../components/diy-router-link';
import './diy-auth';
import './diy-auth-state';
import './diy-toolbar';

@customElement('diy-app')
export class DiyApp extends LitElement {
  static styles = [
    sharedStyles, css`
    :host {
      display: flex;
      flex-direction: column;
      background-color: var(--primary-background-color);
      min-height: 100vh;
    }`];

  render() {
    return html`
      <diy-auth-state></diy-auth-state>
      <diy-toolbar></diy-toolbar>

      <diy-router-view path="/">
        <p>Welcome page</p>
      </diy-router-view>

      <diy-router-view path="/user/auth">
        <template>
          <diy-auth></diy-auth>
        </template>
      </diy-router-view>
    `;
  }
}
