import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators';

// A link element that sets the hash route according to the `path` property.
@customElement('diy-router-link')
export class DiyRouterLink extends LitElement {
  static styles = css`
    a {
      color: inherit;
      text-decoration: inherit;
    }`;

  @property({type: String}) path = '';

  render() {
    return html`
      <a tabindex="-1" href="#${this.path}">
        <slot></slot>
      </a>
    `;
  }
}
