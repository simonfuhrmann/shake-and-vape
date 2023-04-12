import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators';

import 'oxygen-mdc/oxy-button';

import {sharedStyles} from './diy-styles';

/**
 * A menu box expands from under the toolbar when the opened property is set.
 * TODO: Opacity does not remove the menu from tab order.
 */
@customElement('diy-menu-box')
export class DiyMenuBox extends LitElement {
  static styles = [
    sharedStyles, css`
    #menu {
      position: fixed;
      top: 0;
      left: 5vw;
      right: 5vw;
      z-index: 1;

      opacity: 0;
      pointer-events: none;
      transition: top 200ms ease-out, opacity 200ms ease-out;

      display: flex;
      flex-direction: column;
      background-color: var(--bg-color-3);
      box-shadow: 0 8px 64px rgba(0, 0, 0, 0.5);
      padding: 16px;
      border-radius: 0 0 8px 8px;
    }
    :host([opened]) #menu {
      opacity: 1;
      pointer-events: auto;
      top: var(--diy-toolbar-height);
    }

    #backdrop {
      position: fixed;
      inset: 0 0 0 0;
      background: rgba(0, 0, 0, 0.25);
      opacity: 0;
      pointer-events: none;
      transition: opacity 200ms ease-out;
    }
    :host([opened]) #backdrop {
      opacity: 1;
      pointer-events: auto;
    }

    oxy-button {
      justify-content: flex-start;
    }
    hr {
      width: 100%;
      border-top: 1px solid var(--fg-color-1);
      border-bottom: none;
    }
  `];

  @property({type: Boolean, reflect: true}) opened = false;

  render() {
    return html`
      <div id="menu">
        <oxy-button>Recipes</oxy-button>
        <oxy-button>Flavors</oxy-button>
        <hr>
        <oxy-button>Your Recipes</oxy-button>
        <oxy-button>Your Inventory</oxy-button>
      </div>

      <div id="backdrop" @click=${this.close}></div>
    `;
  }

  private close() {
    this.opened = false;
    this.dispatchEvent(new CustomEvent('closed'));
  }
}
