import {LitElement, query, html, css} from 'lit-element';
import {customElement, internalProperty} from 'lit-element';
import {nothing} from 'lit-html';
import firebase from 'firebase/app';

import {sharedStyles} from './diy-styles';
import {firebaseApi} from '../modules/firebase'
import {OxyDialog} from '../oxygen/oxy-dialog';
import {OxyInput} from '../oxygen/oxy-input';

import '../oxygen/oxy-button';
import '../oxygen/oxy-input';
import '../oxygen/oxy-dialog';

@customElement('diy-auth')
export class DiyAuth extends LitElement {
  static styles = [
    sharedStyles, css`
    :host {
      padding: 32px;
      display: flex;
      flex-direction: column;
    }
    h2 {
      margin: 0 0 0.5em 0;
    }
    oxy-button:not([raised]) {
      text-transform: uppercase;
    }
    oxy-dialog .dialog-content {
      margin: 0 16px;
    }

    #redirect-dialog > div {
      margin: 32px;
      /* FIXME: Remove button slot margin */
      margin-bottom: calc(32px - 24px);
    }
    #providers oxy-button {
      background-color: white;
      margin: 8px 0;
    }
    #providers oxy-button :first-child {
      margin-right: 8px;
    }
    #providers oxy-button:not(:last-child) {
      margin-bottom: 8px;
    }

    .paper-card {
      display: flex;
      flex-direction: column;
      background-color: var(--secondary-background-color);
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: var(--default-box-shadow);
    }
    .paper-card .buttons {
      margin: 8px 0 0 0;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
    .paper-card .buttons :not(:last-child) {
      margin-right: 8px;
    }
    .input-label {
      margin-top: 8px;
      color: var(--secondary-text-color);
      font-size: 0.8em;
    }
    `];

  private firebaseAuth = firebaseApi.getAuth();
  private hasRedirectResult = false;

  @query('#signin-email') signInEmail: OxyInput|undefined;
  @query('#signin-password') signInPassword: OxyInput|undefined;
  @query('#signup-email') signUpEmail: OxyInput|undefined;
  @query('#signup-password1') signUpPassword1: OxyInput|undefined;
  @query('#signup-password2') signUpPassword2: OxyInput|undefined;
  @query('#redirect-dialog') redirectDialog: OxyDialog|undefined;
  @internalProperty() currentUser: firebase.User|null = null;
  @internalProperty() errorDialogMessage = '';

  updated() {
    this.getRediectResultOnce();
  }

  getRediectResultOnce() {
    if (this.hasRedirectResult) return;
    this.hasRedirectResult = true;

    this.redirectDialog?.open();
    this.firebaseAuth.getRedirectResult()
        .then(data => {
          this.redirectDialog?.close();
          if (this.firebaseAuth.currentUser) {
            // Redirect user to the home page.
            window.location.hash = '';
          } else {
            console.log('redirect no user', data);
          }

        })
        .catch(error => {
          this.redirectDialog?.close();
          this.openErrorDialog(error.toString());
        });
  }

  render() {
    return html`
      ${this.renderUserInfo()}
      ${this.renderProviders()}
      ${this.renderEmailSignin()}
      ${this.renderEmailSignup()}
      ${this.renderRedirectDialog()}
      ${this.renderErrorDialog()}
    `;
  }

  private renderUserInfo() {
    if (!this.currentUser) return nothing;
    return html`
      <div id="userinfo" class="paper-card">
        <h2>You are signed in</h2>
        <div>User: ${this.currentUser.displayName}</div>
        <div>Email: ${this.currentUser.email}</div>
        <div>ID: ${this.currentUser.uid}</div>
        <div class="buttons">
          <oxy-button @click=${this.onSignOut}>Sign out</oxy-button>
        </div>
      </div>
    `;
  }

  private renderProviders() {
    return html`
      <div id="providers" class="paper-card">
        <h2>Third-party sign-in</h2>
        <oxy-button raised @click=${this.signInGoogle}>
          <oxy-icon icon="logos:google"></oxy-icon>
          <div>Sign in with Google</div>
        </oxy-button>

        <oxy-button raised @click=${this.signInGithub}>
          <oxy-icon icon="logos:github"></oxy-icon>
          <div>Sign in with Github</div>
        </oxy-button>
      </div>
    `;
  }

  private renderEmailSignin() {
    return html`
      <div class="paper-card">
        <h2>Email sign-in</h2>
        <div class="input-label">Email</div>
        <oxy-input id="signin-email"></oxy-input>
        <div class="input-label">Password</div>
        <oxy-input id="signin-password"></oxy-input>
        <div class="buttons">
          <oxy-button @click=${this.onResetPass}>Rest password</oxy-button>
          <oxy-button @click=${this.onSignIn}>Sign in</oxy-button>
        </div>
      </div>
    `;
  }

  private renderEmailSignup() {
    return html`
      <div class="paper-card">
        <h2>Email sign-up</h2>
        <div class="input-label">Email</div>
        <oxy-input id="signup-email"></oxy-input>
        <div class="input-label">Password</div>
        <oxy-input id="signup-password1"></oxy-input>
        <div class="input-label">Password (repeat)</div>
        <oxy-input id="signup-password2"></oxy-input>
        <div class="buttons">
          <oxy-button @click=${this.onSignUp}>Sign up</oxy-button>
        </div>
      </div>
    `;
  }

  private renderRedirectDialog() {
    return html`
      <oxy-dialog id="redirect-dialog" backdrop>
        <div>Waiting for redirect result...</div>
      </oxy-dialog>
    `;
  }

  private renderErrorDialog() {
    const clearErrorHandler = () => { this.errorDialogMessage = ''; };
    return html`
      <oxy-dialog
          heading="Something went wrong"
          backdrop
          ?opened=${!!this.errorDialogMessage}
          @closed=${clearErrorHandler}>
        <div class="dialog-content">${this.errorDialogMessage}</div>
        <div slot="buttons">
          <oxy-button @click=${clearErrorHandler}>Close</oxy-button>
          <!-- FIXME Focus issues, button doesn't support ENTER or SPACE -->
        </div>
      </oxy-dialog>
    `;
  }

  private signInGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    this.firebaseAuth.signInWithRedirect(provider);
  }

  private signInGithub() {
    const provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('user:email');
    this.firebaseAuth.signInWithRedirect(provider);
  }

  private onSignIn() {
    const email = this.signInEmail?.value || '';
    const pass = this.signInPassword?.value || '';
    this.firebaseAuth.signInWithEmailAndPassword(email, pass)
        .then((/*data*/) => {
          // If sign-up was successful, return to home.
          // TODO
        })
        .catch((error) => {
          this.openErrorDialog(error.message);
        });
  }

  private onResetPass() {
    // TODO
  }

  private onSignUp() {
    // TODO
  }

  private onSignOut() {
    this.firebaseAuth.signOut();
  }

  private openErrorDialog(errorMessage: string) {
    this.errorDialogMessage = errorMessage;
  }
}
