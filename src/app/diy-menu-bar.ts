import {LitElement, css, html} from 'lit';
import {customElement} from 'lit/decorators';

import 'oxygen-mdc/oxy-tabs';
import 'oxygen-mdc/oxy-tab';

import {sharedStyles} from './diy-styles';

/**
 * A menu bar that only shows up if the screen is wide enough.
 */
@customElement('diy-menu-bar')
export class DiyMenuBar extends LitElement {
  static styles = [
    sharedStyles, css`
    :host {
      background-color: var(--bg-color-3);
    }
    oxy-tabs {
      user-select: none;
      margin-top: 4px;
      padding: 0 8px;
    }
    .separator {
      width: 1px;
      background-color: #ccc;
      margin: 8px 16px;
    }

    @media screen and (max-width: 690px) {
      oxy-tabs {
        display: none;
      }
    }
  `];

  render() {
    return html`
      <oxy-tabs>
        <oxy-tab>Recipes</oxy-tab>
        <oxy-tab>Flavors</oxy-tab>
        <div class="separator"></div>
        <oxy-tab>Your Recipes</oxy-tab>
        <oxy-tab>Your Inventory</oxy-tab>
      </oxy-tabs>
    `;
  }
}
