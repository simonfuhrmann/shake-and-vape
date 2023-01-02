import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators';

import {firestoreApi} from '../modules/firestore-api';

@customElement('diy-user-name')
export class DiyUserName extends LitElement {
  @property({type: String}) uid = '';
  @property() name = '';

  update(changedProps: Map<string, unknown>) {
    if (changedProps.has('uid')) {
      firestoreApi.usernameForUid(this.uid)
          .then((name: string) => { this.name = name; })
          .catch(() => {this.name = '(error)'});
    }
    super.update(changedProps);
  }

  render() {
    return html`${this.name}`;
  }
}
