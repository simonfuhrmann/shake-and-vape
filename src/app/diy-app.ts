import {LitElement, css, html} from 'lit';
import {customElement} from 'lit/decorators';

import {sharedStyles} from './diy-styles';
import {initState} from '../modules/state-init';

import '../components/diy-router-view';
import '../components/diy-router-link';
import './diy-auth';
import './diy-auth-state';
import './diy-user-profile';
import './diy-toolbar';
import './diy-welcome-page';
import './diy-menu-bar';

@customElement('diy-app')
export class DiyApp extends LitElement {
  static styles = [
    sharedStyles, css`
    :host {
      display: flex;
      flex-direction: column;
      background-color: var(--bg-color-2);
      min-height: 100vh;
    }`];

  constructor() {
    super();
    initState();
  }

  render() {
    return html`
      <diy-auth-state></diy-auth-state>
      <diy-toolbar></diy-toolbar>
      <diy-menu-bar></diy-menu-bar>

      <diy-router-view path="/">
        <template>
          <diy-welcome-page></diy-welcome-page>
        </template>
      </diy-router-view>

      <diy-router-view path="/user/auth">
        <template>
          <diy-auth></diy-auth>
        </template>
      </diy-router-view>

      <diy-router-view path="/user/profile">
        <template>
          <diy-user-profile></diy-user-profile>
        </template>
      </diy-router-view>
    `;
  }
}
