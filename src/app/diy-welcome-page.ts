import {LitElement, css, html} from 'lit';
import {customElement} from 'lit/decorators';

import {sharedStyles} from './diy-styles';

@customElement('diy-welcome-page')
export class DiyWelcomePage extends LitElement {
  static styles = [
    sharedStyles, css`
    :host {
      display: flex;
      flex-direction: column;
    }
    #content {
      padding: 16px;
    }
  `];

  render() {
    return html`
      <div id="content">
        <p>Welcome</p>
      </div>
    `;
  }
}
