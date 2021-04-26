import {LitElement, css, html} from 'lit';
import {customElement} from 'lit/decorators';

import {sharedStyles} from './diy-styles';

@customElement('diy-welcome-page')
export class DiyWelcomePage extends LitElement {
  static styles = [
    sharedStyles, css`
    :host {
      max-width: var(--default-content-width);
      margin: 0 auto;
      padding: 32px;
      display: flex;
      flex-direction: column;
    }`];

  render() {
    return html`
      <div class="explore">
        <div class="paper-card">
          <p>Welcome</p>
        </div>
      </div>
    `;
  }
}
