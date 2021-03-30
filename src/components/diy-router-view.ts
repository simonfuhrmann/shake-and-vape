import {LitElement, html} from 'lit-element';
import {customElement, property, internalProperty} from 'lit-element';
import {nothing} from 'lit-html';

// A router view which displays the slotted contents only if the current hash
// route matches the `path` property. To avoid always instantiating all routes
// it is advised to wrap the route contents in a template element:
//
//   <diy-router-view path="/mypath">
//     <template>
//       <my-element></my-element>
//     </template>
//   </div-router-view>
//
// The template is instantiated and connected to the DOM when the route becomes
// active, and disconnected from the DOM when the route becomes inactive.
@customElement('diy-router-view')
export class DiyRouterView extends LitElement {
  private hashChangeHandler = this.onHashChange.bind(this);

  @property({type: String}) path = '';
  @internalProperty() currentPath = '';
  @internalProperty() templateClone: Node|undefined;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('hashchange', this.hashChangeHandler, false);
    this.hashChangeHandler();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this.hashChangeHandler);
  }

  render() {
    if (!this.isRouteActive()) return nothing;
    return html`
      <slot></slot>
      ${this.templateClone}
    `;
  }

  private isRouteActive() {
    return this.path === this.currentPath;
  }

  private onHashChange() {
    this.currentPath = window.location.hash.slice(1);
    if (!this.isRouteActive()) return;

    const child = this.firstElementChild as HTMLTemplateElement;
    if (child?.tagName !== 'TEMPLATE') return;
    this.templateClone = child.content.cloneNode(true);
  }
}
