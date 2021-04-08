import {css} from 'lit-element';

export const sharedStyles = css`
  :host {
    --primary-background-color: #eceff1;
    --secondary-background-color: #f9fafb;
    --tertiary-background-color: #fff;
    --toolbar-background-color: #424b4b;

    --primary-text-color: #000;
    --secondary-text-color: #333;
    --disabled-text-color: #666;

    --error-text-color: #f00;
    --success-text-color: #0f0;
    --separator-color: #999;

    --button-background-color: #1a73e8;
    --button-foreground-color: white;

    --default-box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
        0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);

    --default-content-width: 690px;

    --oxy-input-border-color-focused: #aaa;

    --oxy-scrollbar-width: 12px;
    --oxy-scrollbar-track-color: transparent;
    --oxy-scrollbar-track-border-radius: 0;
    --oxy-scrollbar-thumb-color: transparent;
    --oxy-scrollbar-thumb-border: 1px solid transparent;
    --oxy-scrollbar-thumb-border-radius: 3px;
    --oxy-scrollbar-thumb-box-shadow:
        inset 0 0 0 var(--oxy-scrollbar-width) var(--disabled-text-color);
    --oxy-scrollbar-thumb-hover-color: transparent;
    --oxy-scrollbar-thumb-hover-box-shadow:
        inset 0 0 0 var(--oxy-scrollbar-width) var(--tertiary-text-color);
  }

  oxy-button[raised] {
    background-color: var(--button-background-color);
    color: var(--button-foreground-color);
    box-shadow: var(--default-box-shadow);
  }
  oxy-button:not([raised]) {
    text-transform: uppercase;
  }
  oxy-button > oxy-icon:not(:last-child) {
    margin-right: 8px;
  }

  oxy-dialog > .content {
    margin: 0 16px;
  }

  .paper-card {
    background-color: var(--secondary-background-color);
    box-shadow: var(--default-box-shadow);
    padding: 16px;
  }
  .paper-card > .buttons {
    margin: 8px 0 0 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .paper-card > h2 {
      margin: 8px 0 16px 0;
  }

  .scrollable::-webkit-scrollbar {
    width: var(--oxy-scrollbar-width);
  }
  .scrollable::-webkit-scrollbar-track {
    background: var(--oxy-scrollbar-track-color);
    border-radius: var(--oxy-scrollbar-track-border-radius);
  }
  .scrollable::-webkit-scrollbar-thumb {
    background: var(--oxy-scrollbar-thumb-color);
    border: var(--oxy-scrollbar-thumb-border);
    border-radius: var(--oxy-scrollbar-thumb-border-radius);
    box-shadow: var(--oxy-scrollbar-thumb-box-shadow);
  }
  .scrollable::-webkit-scrollbar-thumb:hover {
    background: var(--oxy-scrollbar-thumb-hover-color);
    box-shadow: var(--oxy-scrollbar-thumb-hover-box-shadow);
  }

  [hidden] {
    display: none !important;
  }
`;
