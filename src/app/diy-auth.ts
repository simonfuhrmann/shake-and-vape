import {LitElement, query, html, css} from 'lit-element';
import {customElement, internalProperty} from 'lit-element';
import {nothing} from 'lit-html';
import firebase from 'firebase/app';

import {StateMixin, State} from '../mixins/state-mixin';
import {sharedStyles} from './diy-styles';
import {firebaseApi} from '../modules/firebase'
import {OxyDialog} from '../oxygen/oxy-dialog';
import {OxyInput} from '../oxygen/oxy-input';

import '../oxygen/oxy-button';
import '../oxygen/oxy-input';
import '../oxygen/oxy-dialog';

@customElement('diy-auth')
export class DiyAuth extends StateMixin(LitElement) {
  static styles = [
    sharedStyles, css`
    :host {
      max-width: var(--default-content-width);
      margin: 0 auto;
      padding: 32px;
      display: flex;
      flex-direction: column;
    }
    h2 {
      margin: 8px 0 16px 0;
    }
    p {
      margin-top: 0;
    }
    oxy-dialog .dialog-content {
      margin: 0 16px;
    }

    #auth-providers oxy-button {
      margin: 8px 0;
    }
    #auth-methods {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      margin: -8px;
    }
    #auth-methods > * {
      flex-grow: 1;
      flex-basis: 0;
      margin: 8px;
      min-width: 256px;
    }
    #waiting-auth-dialog > div,
    #sending-email-dialog > div {
      margin: 32px;
      /* FIXME: Remove button slot margin in <oxy-dialog> */
      margin-bottom: calc(32px - 24px);
    }

    .paper-card {
      display: flex;
      flex-direction: column;
    }
    .input-label {
      margin-top: 8px;
      color: var(--secondary-text-color);
      font-size: 0.8em;
    }
    `];

  private firebaseAuth = firebaseApi.getAuth();
  private wasInitializedOnce = false;
  private waitingAuthDialogTimeout = -1;

  @query('#email-input') emailInput: OxyInput|undefined;
  @query('#email-confirm-input') emailConfirmInput: OxyInput|undefined;
  @query('#waiting-auth-dialog') waitingAuthDialog: OxyDialog|undefined;
  @query('#sending-email-dialog') sendingEmailDialog: OxyDialog|undefined;
  @internalProperty() isSignInWithEmailLink = false;
  @internalProperty() infoDialogHeading = '';
  @internalProperty() infoDialogMessage = '';

  connectedCallback() {
    super.connectedCallback();

    // Signs the user in after opening the website from an email link.
    if (this.firebaseAuth.isSignInWithEmailLink(window.location.href)) {
      this.isSignInWithEmailLink = true;
      const email = window.localStorage.getItem('emailForSignIn');
      window.localStorage.removeItem('emailForSignIn');
      if (!email) return;
      this.signInWithEmail(email);
    }
  }

  stateChanged(newState: State) {
    if (newState.firebaseUser) {
      this.redirectAfterSignIn();
    }
  }

  updated() {
    this.initializeOnce();
  }

  initializeOnce() {
    if (this.wasInitializedOnce) return;
    this.wasInitializedOnce = true;

    // Open a dialog that tells the user to wait during third-party sign-in. If
    // no third-party sign-in happened, the promise resolves immediately.
    this.openWaitingForAuthDialog();
    this.firebaseAuth.getRedirectResult()
        .then(data => {
          this.closeWaitingForAuthDialog();
          // If the user did not attempt to sign-in: Ignore this case.
          if (!data.user) return;
          // The sign-in process was successful. Redirect user.
          this.redirectAfterSignIn();
        })
        .catch(error => {
          this.closeWaitingForAuthDialog();
          this.openInfoDialog('Something went wrong', error.message);
        });
  }

  render() {
    return html`
      ${this.renderAuthMethods()}
      ${this.renderEmailConfirm()}
      ${this.renderWaitingForAuthDialog()}
      ${this.renderSendingEmailDialog()}
      ${this.renderInfoDialog()}
    `;
  }

  private renderAuthMethods() {
    if (this.isSignInWithEmailLink) return nothing;
    return html`
      <div id="auth-methods">
        ${this.renderProviders()}
        ${this.renderEmailAuth()}
      </div>
    `;
  }

  private renderProviders() {
    return html`
      <div id="auth-providers" class="paper-card">
        <h2>Third-party sign-in</h2>
        <p>
          Use one of the third-party sign-in methods below for frictionless
          authentication. We won't send you spam ever.
        </p>
        <oxy-button raised @click=${this.signInWithGoogle}>
          <oxy-icon icon="logos:google"></oxy-icon>
          <div>Sign in with Google</div>
        </oxy-button>

        <oxy-button raised @click=${this.signInWithGithub}>
          <oxy-icon icon="logos:github"></oxy-icon>
          <div>Sign in with Github</div>
        </oxy-button>
      </div>
    `;
  }

  private renderEmailAuth() {
    return html`
      <div id="auth-email" class="paper-card">
        <h2>Email sign-in</h2>
        <p>
          We offer password-less email sign-in. Provide your email
          address, and you will receive a link to sign-in with.
        </p>
        <div class="input-label">Email</div>
        <oxy-input id="email-input"></oxy-input>
        <div class="buttons">
          <oxy-button @click=${this.onSendEmailLink}>Send link</oxy-button>
        </div>
      </div>
    `;
  }

  private renderEmailConfirm() {
    if (!this.isSignInWithEmailLink) return nothing;
    const authHandler = () => {
      const email = this.emailConfirmInput?.value;
      if (!email) return;
      this.signInWithEmail(email);
    };
    return html`
      <div id="email-confirm" class="paper-card">
        <h2>Enter email address</h2>
        <p>
          We couldn't find the breadcrumb we left behind to identify you.
          If you reached here using an sign-in link from an email, just enter
          your email address again, and you'll be all set.
        </p>
        <div class="input-label">Email</div>
        <oxy-input id="email-confirm-input"></oxy-input>
        <div class="buttons">
          <oxy-button @click=${authHandler}>Authenticate</oxy-button>
        </div>
      </div>
    `;
  }

  private renderWaitingForAuthDialog() {
    return html`
      <oxy-dialog id="waiting-auth-dialog" backdrop noescape>
        <div>Waiting for authentication...</div>
      </oxy-dialog>
    `;
  }

  private renderSendingEmailDialog() {
    return html`
      <oxy-dialog id="sending-email-dialog" backdrop noescape>
        <div>Sending sign-in email...</div>
      </oxy-dialog>
    `;
  }
  private renderInfoDialog() {
    const closeDialogHandler = () => {
      this.infoDialogHeading = '';
      this.infoDialogMessage = '';
    };
    return html`
      <oxy-dialog
          heading=${this.infoDialogHeading}
          backdrop
          ?opened=${!!this.infoDialogMessage}
          @closed=${closeDialogHandler}>
        <div class="dialog-content">${this.infoDialogMessage}</div>
        <div slot="buttons">
          <oxy-button @click=${closeDialogHandler}>Close</oxy-button>
          <!-- FIXME Focus issues, button doesn't support ENTER or SPACE -->
        </div>
      </oxy-dialog>
    `;
  }

  private signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    this.firebaseAuth.signInWithRedirect(provider);
  }

  private signInWithGithub() {
    const provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('user:email');
    this.firebaseAuth.signInWithRedirect(provider);
  }

  private signInWithEmail(email: string) {
    this.openWaitingForAuthDialog();
    this.firebaseAuth.signInWithEmailLink(email, window.location.href)
        .then(() => {
          this.closeWaitingForAuthDialog();
          this.redirectAfterSignIn();
        })
        .catch((error) => {
          this.closeWaitingForAuthDialog();
          this.openInfoDialog('Something went wrong', error.message);
          this.isSignInWithEmailLink = false;
        });
  }

  private onSendEmailLink() {
    const email = this.emailInput?.value || '';
    if (!email) {
      this.openInfoDialog(
          'Something went wrong', 'The e-mail address is invalid.');
      return;
    }

    const actionCodeSettings = {
      url: window.location.origin + '/#/user/auth',
      handleCodeInApp: true,
    };
    this.sendingEmailDialog?.open();
    this.firebaseAuth.sendSignInLinkToEmail(email, actionCodeSettings)
        .then(() => {
          this.sendingEmailDialog?.close();
          window.localStorage.setItem('emailForSignIn', email);
          this.openInfoDialog(
              'Email sent',
              'Please check your inbox for an email to sign-in with.');
        })
        .catch((error) => {
          this.sendingEmailDialog?.close();
          this.openInfoDialog('Something went wrong', error.message);
        });
  }

  private openWaitingForAuthDialog() {
    this.waitingAuthDialogTimeout = window.setTimeout(() => {
      this.waitingAuthDialog?.open();
    }, 100);
  }

  private closeWaitingForAuthDialog() {
    if (this.waitingAuthDialogTimeout >= 0) {
      window.clearTimeout(this.waitingAuthDialogTimeout);
      this.waitingAuthDialogTimeout = -1;
    }
    this.waitingAuthDialog?.close();
  }

  private openInfoDialog(heading: string, message: string) {
    this.infoDialogHeading = heading;
    this.infoDialogMessage = message;
  }

  private redirectAfterSignIn() {
    // The mail link leaves some URL garbage behind. Clear that out.
    const href = window.location.href.replace(/\?.*/, '')
    window.history.replaceState({}, '', href);
    // Clear the hash, to redirect to the main route.
    window.location.hash = '/';
  }
}
